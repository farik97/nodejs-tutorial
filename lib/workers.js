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
                        console.log('error reading one of the checks data')
                    }
                })
            })
        } else {
            console.log('error could not find any checks to process')
        }
    })
}

// sanity check the check data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {}
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim(): false
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'number' && originalCheckData.userPhone.trim.length > 10 ? originalCheckData.userPhone.trim(): false
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol: false
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim(): false
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['POST', 'PUT', 'DELETE', 'GET'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method: false
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ?  originalCheckData.successCodes: false
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds: false
    
    // set the keys that may not be set if the workers has never seen this check before
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['UP', 'DOWN', 'up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state: down
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked: false

    // if all the checks pass, pass the data to the next process
    if(originalCheckData.id && 
        originalCheckData.userPhone && 
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds){
            workers.performCheck(originalCheckData)
        } else {
            console.log('error: one of the checks is not properly formatted')
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
        
    }
}

// timer to execute the worker progress
workers.loop = () => {
    setInterval(()=>{
        workers.gatherAllChecks()
    },1000*60)
}

// init script
workers.init = () => {
    // execute all the checks immediately
    workers.gatherAllChecks()
    // call the loop so the checks will execute later on
    workers.loop()
}


// export the module
module.exports = workers