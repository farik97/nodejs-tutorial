/*
* Helpers for various tasks
*
*/

// dependencies
var crypto = require('crypto')
var config = require('./config')
var https = require('https')
var queryString = require('querystring')
const path = require('path')
const fs = require('fs')
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
    if (phone && msg){
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
            'protocol': 'https:', 
            'hostname': 'api.twilio.com', 
            'method': 'POST',
            'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
            'auth': config.twilio.accountSid+':'+config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
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

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function(templateName,data,callback){
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};
    if(templateName){
      var templatesDir = path.join(__dirname,'/../templates/');
      fs.readFile(templatesDir+templateName+'.html', 'utf8', function(err,str){
        if(!err && str && str.length > 0){
          // Do interpolation on the string
          var finalString = helpers.interpolate(str,data);
          callback(false,finalString);
        } else {
          callback('No template could be found');
        }
      });
    } else {
      callback('A valid template name was not specified');
    }
  };

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function(str,data,callback){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};
    // Get the header
    helpers.getTemplate('_header',data,function(err,headerString){
      if(!err && headerString){
        // Get the footer
        helpers.getTemplate('_footer',data,function(err,footerString){
          if(!err && headerString){
            // Add them all together
            var fullString = headerString+str+footerString;
            callback(false,fullString);
          } else {
            callback('Could not find the footer template');
          }
        });
      } else {
        callback('Could not find the header template');
      }
    });
  };

//  take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof(str) == 'string' && str.length > 0 ? str: ''
    data = typeof(data) == 'object' && data !== null ? data : {}
    
    //  add the templateGlobals do the data object, prepending their key name with "global"
    for (var keyName in config.templateGlobals) {
        if(config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.'+keyName] = config.templateGlobals[keyName]
        }
    }

    //  for each key in the data object, insert its value into the string at the corresponding placeholder
    for ( var key in data) {
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
            var replace = data[key]
            var find = '{'+key+'}'
            str = str.replace(find,replace)    
        }
    }
    return str
}
  
// Get the contents of a static (public) asset
helpers.getStaticAsset = function(fileName,callback){
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName){
      var publicDir = path.join(__dirname,'/../public/');
      fs.readFile(publicDir+fileName, function(err,data){
        if(!err && data){
          callback(false,data);
        } else {
          callback('No file could be found');
        }
      });
    } else {
      callback('A valid file name was not specified');
    }
  };

// export the module
module.exports = helpers

