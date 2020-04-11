/* 
*   worker related tasks
*
*/

// dependencies
var path = require('path')
var fs = require('fs')
var data = require('./data')
var https = require('https')
var http = require('http')
var helpers = require('./helpers')
var url = require('url')
var _logs = require('./logs')
var util = require('util')
var debug = util.debuglog('workers')

// instantiate the worker object
var workers = {}

// look up all the checks get their data and send it to a validator
workers.gatherAllChecks = ()=>{
    // get all the checks that exist in the system
    data.list('checks', (err, checks)=>{
        if (!err && checks && checks.length > 0){
            checks.forEach((check)=>{
                data.read('checks', check, (err, originalCheckData)=>{
                    if(!err && originalCheckData){
                        // pass the data to the check validator
                        workers.validateCheckData(originalCheckData)
                    } else {
                        debug('error reading one of the checks data')
                    }
                })
            })
        } else {
            debug('error could not find any checks to process')
        }
    })
}

// sanity check the check data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {}
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim(): false
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length >= 10 ? originalCheckData.userPhone : false
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol: false
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim(): false
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['POST', 'PUT', 'DELETE', 'GET'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method: false
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ?  originalCheckData.successCodes: false
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds: false
    

    // set the keys that may not be set if the workers has never seen this check before
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state: 'down'
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked: false
    // if all the checks pass, pass the data to the next process
    if(originalCheckData.id && 
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds
        ){
            workers.performCheck(originalCheckData)
        } else {
            debug('error: one of the checks is not properly formatted')
        }
}

// perform the check, send the originalCheckData and the outcome of the check process, to the next step
workers.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    var checkOutcome = {
        'error': false,
        'responseCode': false
    }

    // mark that the outcome has not been sent yet
    var outcomeSent = false

    // parse the hostname and the path of the original check data
    var parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true)
    var hostName = parsedUrl.hostname
    var path = parsedUrl.path

    // constructing the request
    var requestDetails = {
        'protocol': originalCheckData.protocol+':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    }

    // instantiate the request object use: http/https
    var _moduleToUse = originalCheckData.protocol == 'http' ? http: https
    var req = _moduleToUse.request(requestDetails, (res)=>{
        // grab the status of the sent request
        var status = res.statusCode
        // update the checkOUTCOME and pass the data along
        checkOutcome.responseCode = status
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })
    // bind to the error so it doesnt get thrown
    req.on('error', (e)=>{
        // update the checkoutcome and pass data along
        checkOutcome.error = {
            'error': true,
            'value': e
        }
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })
    // bind to the timeout so it doesnt get thrown
    req.on('timeout', (e)=>{
        // update the checkoutcome and pass data along
        checkOutcome.error = {
            'error': true,
            'value': 'timeout'
        }
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })
    // end the process
    req.end()
}

// process the checkoutcome and update the checkdata as needed and trigger alert to the user
// special logic for accommodating a check that has never been tested before
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
    
    // decide if the check is considered up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) >-1 ? 'up': 'down'
    
    // decide if an alert is warranted
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true: false
    
    // log the outcome
    let timeOfCheck = Date.now()
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck)

    // update the check data
    var newCheckData = originalCheckData
    newCheckData.state = state
    newCheckData.lastChecked = timeOfCheck

    data.update('checks', newCheckData.id, newCheckData, (err)=>{
        if(!err){
            // send the new check data to the next phase in the process if needed
            if(alertWarranted){
                workers.alertUserToStatusChange(newCheckData)
            } else {
                debug('check outcome has not changed, no alert is needed')
            }
        } else {
            debug('error trying to save updates to one of the checks')
        }
    })
}

// alert user to status change
workers.alertUserToStatusChange = (newCheckData) => {
    var msg = 'Alert: your check for ' + newCheckData.method.toUpperCase()+ ' '+ newCheckData.protocol+'://'+newCheckData.url + ' is currently ' + newCheckData.state
    helpers.sendTwilioSms(newCheckData.userPhone, msg, (err)=>{
        if(!err){
            debug('success: user was alerted to a status change via sms', msg)
        } else {
            debug('error: could not send sms alert to user who had a state change in their check', err)
        }
    })
}


// log the workers log to a file
workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    
    // form the log data
    let logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        'state': state, 
        'alert': alertWarranted,
        'time': timeOfCheck
    }

    // stringify the log data
    let logString = JSON.stringify(logData)

    // determine the name of the log file
    let logFileName = originalCheckData.id

    // append the logdata to a file
    _logs.append(logFileName, logString, (err) => {
        if(!err){
            debug('logging succeeded')
        } else {
            debug(`logging failed, due to error: ${err}`)
        }
    })

}

// timer to execute the worker progress
workers.loop = () => {
    setInterval(()=>{
        workers.gatherAllChecks()
    },1000*6)
}

// rotate the logs
workers.rotateLogs = () => {
    _logs.list(false, (err, logs)=>{
        if(!err && logs && logs.length > 0) {
            logs.forEach((logName)=>{
                //compress the data into a different file
                var logId =logName.replace('.log', '')
                var newFileId = logId + '-' + Date.now()
                
                //
                _logs.compress(logId, newFileId, (err)=> {
                    if (!err) {
                        // truncate the log
                        _logs.truncate(logId, (err)=>{
                            if(!err) {
                                debug('success truncating log file')
                            } else {
                                debug('error truncating log files')
                            }
                        })
                    } else {
                        debug('could not compress the logs')
                    }
                })
            })
        } else {
            debug('error: could not find any logs to rotate')
        }
    })
}

// timer to execute the log rotation once per day
workers.logRotationLoop = () =>{
    setInterval(()=>{
        workers.rotateLogs()
    },1000*60*60*24)
}

// init script
workers.init = () => {

    // send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running')

    // execute all the checks immediately
    workers.gatherAllChecks()
    // call the loop so the checks will execute later on
    workers.loop()

    // compress all the logs immediately
    workers.rotateLogs()

    // call the compression loop so logs will be compressed later
    workers.logRotationLoop()
}


// export the module
module.exports = workers