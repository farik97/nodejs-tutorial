/* 
* API Tests
*/

//  dependencies
const app = require('./../index')
const assert = require('assert')
const http = require('http')
const config = require('./../lib/config')

//  hodler for the tests
let api = {}

//  helpers
let helpers = {}

helpers.makeGetRequest = (path, callback) => {
    //  confire the req details
    let requestDetails = {
        'protocol': 'http:',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    //  send the request
    let req = http.request(requestDetails, (res)=>{
        callback(res)
    })
    req.end()
}

//  the main init func should be able to run without throwing
api['app.init should start without throwing'] = (done) => {
    assert.doesNotThrow(()=>{
        app.init((err)=>{
            done()
        })
    }, TypeError)
}

//  make a request to ping
api['/ping should respond to get with 200'] = (done) => {
    helpers.makeGetRequest('/ping', (res)=>{
        assert.equal(res.statusCode, 200)
        done()
    })
}

//  make request to /api/users
api['/api/users should respond to GET with 400'] = (done) => {
    helpers.makeGetRequest('/api/users', (res)=>{
        assert.equal(res.statusCode, 400)
        done()
    })
}

//  make request to random path
api['/randomPath should respond to GET with 404'] = (done) => {
    helpers.makeGetRequest('/randomPath', (res)=>{
        assert.equal(res.statusCode, 404)
        done()
    })
}

//  export the tests to the runner
module.exports = api