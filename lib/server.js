/*
* server related tasks
*
*/

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')
var fs = require('fs')
var handlers = require('./handlers')
var helpers = require('./helpers')
var path = require('path')
var util = require('util')
var debug = util.debuglog('server')

// instantiate the server module object
var server = {}

// instantiatiing the http server
server.httpServer = http.createServer(function(req, res){
    server.unifiedServer(req,res)
})

//instantiate the https server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cart': fs.readFileSync(path.join(__dirname,'/../https/cart.pem'))
}

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    unifiedServer(req,res)
})

// all the server for both http and https
server.unifiedServer = function (req, res) {
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
        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound

        // construct data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        }

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload, contentType){

            //  determine the type of response
            contentType = typeof(contentType) == 'string' ? contentType : 'json'
            
            // use the status code called back by the handler, or default
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // return the response parts that are content specific
            let payloadString = ''
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json')
                payload = typeof(payload) == 'object' ? payload : {}
                payloadString = JSON.stringify(payload)
            } 
            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html')
                payloadString = typeof(payload) == 'string' ? payload : ''
            }

            //  return the response common to all content types
            res.writeHead(statusCode)
            res.end(payloadString)

            // if the response is 200 print green otherwise print red
            if (statusCode !== 200) {
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode)
            } else {
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode)
            }
        })
    })
}

// define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/delete': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/delete': handlers.sessionDeleted,
    'checks/all': handlers.checkList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks
}

// init script
server.init = function(){
    // start the http server
    // start the http server
    server.httpServer.listen(config.httpPort,function(){
    console.log('\x1b[36m%s\x1b[0m', 'the server is listening on port ' + config.httpPort)
    })
    // start the https server
    server.httpsServer.listen(config.httpsPort,function(){
    console.log('\x1b[35m%s\x1b[0m','the server is listening on port ' + config.httpsPort)
    })
}

module.exports = server