/*
* Primary file for the API
*
*/

// dependencies
var server = require('./lib/server')
var workers = require('./lib/workers')
const cli = require('./lib/cli')

// declare the app
var app = {};

foo = 'bar';

// init function
app.init = function(){
    // start the server
    server.init()

    // start the workers 
    workers.init()

    //  start the cli last
    setTimeout(()=>{
        cli.init()
    }, 50)

}

// execute 
app.init()

// export the app
module.exports = app