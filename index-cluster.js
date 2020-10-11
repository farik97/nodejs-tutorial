/*
* Primary file for the API
*
*/

// dependencies
var server = require('./lib/server')
var workers = require('./lib/workers')
const cli = require('./lib/cli')
const cluster = require('cluster')
const os = require('os')

// declare the app
var app = {}

// init function
app.init = function(callback){

    if (cluster.isMaster) {
        // start the workers 
        workers.init()

        //  start the cli last
        setTimeout(()=>{
            cli.init()
            callback()
        }, 50)

        //  fork the process
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork()
        }
        
    } else {
        // start the server
        server.init()
    }

}

// Self-invoking only if required directly
if(require.main === module) {
    app.init(()=>{})
}  


// export the app
module.exports = app