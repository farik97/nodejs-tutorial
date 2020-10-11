/*
* Primary file for the API
*
*/

// dependencies
var server = require('./lib/server')
var workers = require('./lib/workers')
const cli = require('./lib/cli')

// declare the app
var app = {}

// init function
app.init = function(callback){
    // start the server
    server.init()

    // start the workers 
    workers.init()

    //  start the cli last
    setTimeout(()=>{
        cli.init()
        callback()
    }, 50)

}

// Self-invoking only if required directly
if(require.main === module) {
    app.init(()=>{})
}  


// export the app
module.exports = app