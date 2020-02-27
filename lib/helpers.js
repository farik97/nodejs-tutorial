/*
* Helpers for various tasks
*
*/

// dependencies
var crypto = require('crypto')
var config = require('./config')
var https = require('https')
var queryString = require('querystring')
// container for all the helpers
var helpers = {}

// create a sha256 hash

helpers.hash = function(str) {
    if (typeof(str) == 'string' && str.length >0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
        return hash
    }   else {
        return false
    }
}

// take a string and return object or give an error
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str)
        return obj
    }catch(e){
        return {}
    }
}

// create s tring of random alphanumeric characters of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength: false
    if(strLength){
        // define the all the possible characters
        var possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        // start the string
        var str = ''
        for (i =1; i <= strLength; i++){
            // get a random character from the possiblecharacters string
            var randomCharacter = possibleChars.charAt(Math.floor(Math.random()* possibleChars.length))
            // append this character to the string
            str += randomCharacter
        }
        return str
    } else {
        return false
    }
}

// send an sms message via twilio
helpers.sendTwilioSms = function(phone, msg, callback) {
    // validate parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim(): false
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim(): false
    if (phone && msg ){
        // config the request payload
        var payload = {
            'From': config.twilio.fromPhone, 
            'To': '+1'+phone,
            'Body': msg
        }

        // string the payload
        var stringPayload = queryString.stringify(payload)

        // configure the request details
        var requestDetails = {
            'protocol': 'https', 
            'hostname': 'api.twilio.com', 
            'method': 'POST',
            'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
            'auth': config.twilio.accountSid+':'+config.twilio.authToken,
            'headers': {
                'Content-type': 'application/x-ww-form-urlencoded',
                'Content-length': Buffer.byteLength(stringPayload)
            }
        }

        // instantiate the request object
        var req = https.request(requestDetails, (res)=>{
            // grab the status of the sent request
            var status = res.statusCode

            if(status == 200 || status == 201){
                callback(false)
            } else {
                callback('Status code returned was '+ status)
            }
        })

        // bind to the error event so it doesnt get thrown
        req.on('error', (e)=>{
            callback(e)
        })

        // add the payload
        req.write(stringPayload)

        // end the request
        req.end()
    } else {
        callback('given parameters were missing or invalid')
    }
}

// export the module
module.exports = helpers