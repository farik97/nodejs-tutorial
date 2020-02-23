/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
var config = require('./lib/config')
var fs = require('fs')
var handlers = require('./lib/handlers')
var helpers = require('./lib/helpers')


// instantiatiing the http server
var httpServer = http.createServer(function(req, res){
    unifiedServer(req,res)
})

// start the server
httpServer.listen(config.httpPort,function(){
    console.log("the server is listening on port " + config.httpPort)
})

//instantiate the https server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cart': fs.readFileSync('./https/cart.pem')
}
var httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req,res)
})

// start the https server
httpsServer.listen(config.httpsPort,function(){
    console.log("the server is listening on port " + config.httpsPort)
})

// all the server for both http and https
var unifiedServer = function (req, res) {
    // get the url and parse it
    let parsedURL = url.parse(req.url, true)
    
    // get the path from the url
    let path = parsedURL.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    // get the query string as an object
    let queryStringObject = parsedURL.query;

    // get the http method
    let method = req.method.toUpperCase()
    
    // get the headers as an object
    let headers = req.headers

    // get the payload if any
    let decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', function(data){
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()

        // choose handler for this request, if not found use not found handler
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // construct data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        }

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            
            // use the status code called back by the handler, or default
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            
            //use the payload called back by the handler, or default
            payload = typeof(payload) == 'object' ? payload : {}
            
            // convert the payload to a string
            let payloadString = JSON.stringify(payload)
            
            // return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
        
            // log the request path
            console.log('Request received with this response: ', statusCode, payloadString)
        })
    })
}

// define a request router
var router = {
    'ping' : handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
}