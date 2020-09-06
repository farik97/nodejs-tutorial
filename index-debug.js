/*
* Primary file for the API
*
*/

// dependencies
var server = require('./lib/server')
var workers = require('./lib/workers')
const cli = require('./lib/cli')
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem')

// declare the app
var app = {}

// init function
app.init = function(){
    // start the server
    debugger;
    server.init()
    debugger;

    // start the workers 
    debugger;
    workers.init()
    debugger;

    //  start the cli last
    debugger;
    setTimeout(()=>{
        cli.init()
        debugger;
    }, 50)
    debugger;

    debugger;
    let foo = 1;
    console.log('foo = 1')
    debugger;

    foo++;
    console.log('foo incremented')
    debugger;

    foo = foo * foo
    console.log('foo squared')
    debugger;

    foo = foo.toString();
    console.log('just converted foo to string')
    debugger;

    exampleDebuggingProblem.init();
    console.log('just called the library')
    debugger;

}

// execute 
app.init()

// export the app
module.exports = app