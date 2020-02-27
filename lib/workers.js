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
                    }
                })
            })
        } else {
            console.log('error could not find any checks to process')
        }
    })
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