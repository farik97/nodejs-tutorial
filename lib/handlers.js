/*
*
*
*/

// Dependencies
var _data = require('./data')
var helpers = require('./helpers')
var config = require('./config')
const { parseJsonToObject } = require('./helpers')

// define handlers
var handlers = {}

// ping handler
handlers.ping = function (data, callback) {
    callback(200);
}

// not found handler 
handlers.notFound = function (data, callback) {
    callback(404)
}

/*
* HTML API Handlers
*/
handlers.index = (data, callback) =>{
    if (data.method == 'get') {

        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Uptime Monitor - Made Simple',
            'head.description': 'We offer free simple monitoring of HTTP/HTTPS websites',
            'body.class': 'index'
        }

        //  read in a template as a string
        helpers.getTemplate('index', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  create acccount handler
handlers.accountCreate = (data, callback) => {
    if (data.method == 'get') {

        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Create Account',
            'head.description': 'Sign Up Easy',
            'body.class': 'accountCreate'
        }

        //  read in a template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  create session handler 
handlers.sessionCreate = (data, callback) => {
    if (data.method == 'get') {

        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Sign In Account',
            'head.description': 'Sign In Easy',
            'body.class': 'sessionCreate'
        }

        //  read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  create session handler 
handlers.sessionDeleted = (data, callback) => {
    if (data.method == 'get') {

        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Logged Out',
            'head.description': 'User has logged out',
            'body.class': 'sessionDeleted'
        }

        //  read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  edit account
handlers.accountEdit = (data, callback) => {
    if (data.method == 'get') {
        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        }
        //  read in a template as a string
        helpers.getTemplate('accountEdit', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  delete account
handlers.accountDeleted = (data, callback) => {
    if (data.method == 'get') {
        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Account deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted'
        }
        //  read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, (err, str)=>{
            if (!err && str) {
                //  add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        //  return that page as HTML
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                }) 
            } else {
                callback(500)
            }
        })
    } else {
        callback(405, {'error': 'method not allowed'})
    }
}

//  create a new check
handlers.checksCreate = (data, callback) => {
    if (data.method == 'get') {
        //  prepare data for interplotation
        let templateData = {
            'head.title': 'Check created',
            'body.class': 'checkCreate'
        }
        //  read in a template as a string
        helpers.getTemplate('checksCreate', templateData, (err, str)=>{
            if(!err && str){
                //  add the universal template
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

//  dashboard (view all checks)
handlers.checksList = (data, callback) => {
    //  reject any request that isn't a get
    if(data.method == 'get') {
        //  add template data
        var templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        }
        //  read in a template as a string
        helpers.getTemplate('checksList', templateData, (err, str)=>{
            if(!err && str) {
                helpers.addUniversalTemplates(str, templateData, (err,str)=>{
                    if(!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

//  edit check handler
handlers.checksEdit = (data, callback) => {
    if(data.method == 'get') {
        let templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksEdit'
        }
        helpers.getTemplate('checksEdit', templateData, (err, str)=>{
            if(!err && str) {
                helpers.addUniversalTemplates(str, templateData, (err, str)=>{
                    if(!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
} 

//  favicon 
handlers.favicon = (data, callback) => {
    if (data.method == 'get') {
        helpers.getStaticAsset('favicon.ico', (err, data)=>{
            if (!err && data) {
                callback(200, data, 'favicon')
            } else {
                callback(500)
            }
        })
    } else {
        callback(405)
    }
}

//  public assets
handlers.public = (data, callback) => {
    //  reject any request that isnt a get
    if (data.method == 'get') {
        //  get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace('public/', '').trim()
        if (trimmedAssetName.length > 0) {
            //  read in the asset's data 
            helpers.getStaticAsset(trimmedAssetName, (err, data)=>{
                if (!err && data) {
                    //  determine the content type (default to plain text)
                    let contentType = 'plain'

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css'
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png'
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg'
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon'
                    }

                    //  callback the data
                    callback(200, data, contentType)
                } else {
                    callback(404)
                }
            })
        } else {
            callback(404)
        }
    } else {
        callback(405)
    }
}

/*
* JSON API Handlers
*/

// users
handlers.users = function(data,callback){
    acceptableMethods = ['post','get','put','delete']
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._users[data.method](data,callback)
    } else {
      callback(405, {'error': 'method not allowed'})
    }
};

// container for the users submethods
handlers._users = {}

// users post
// require data: firstname, lastname, phone, password, tosAgreement
handlers._users.post = function (data, callback) {
    // check that all the required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim(): false
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesnt already exist
        _data.read('users', phone, function(err, data){
            if(err){
                // hash the password
                var hashedPassword = helpers.hash(password)

                //create the user object
                if (hashedPassword){
                    var userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    }
    
                    // store the user
                    _data.create('users', phone, userObject, function(err){
                        if (!err){
                            callback(200, {"message": `A user with ${phone} number has registered`})
                        }   else {
                            console.log(err)
                            callback(500, {'error': 'could not create the new user'})
                        }
                    })
                } else {
                    callback(500, {'error': 'could not hash the users password'})
                }
            }   else {
                // user already exists
                callback(404, {'Error': 'a user with that phone already exists'})
            }
        })
    }   else {
        callback(400, {'error': 'missing required fields'})
    }
}

// users get
// required data: phone
// optional data: none
// @TODO only let authenticated users access their object
handlers._users.get = function (data, callback) {
    // check the phone is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false
    if (phone) {
        //get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token: false
        // verify token is for the given user
        handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
            if(tokenIsValid){
                // lookup
                _data.read('users', phone, function(err, data){
                    if(!err && data){
                        // remove the hashed password from the suer object before returning it
                        delete data.hashedPassword;
                        callback(200,data)
                    }   else {
                        callback(404, {err})
                    }
                })
            } else {
                callback(403, {'error': 'missing required token in header or invalid token'})
            }
        })
    } else {
        callback(400, {'Error': "missing required field"})
    }
}

// users put
// required data is phone
// optional data is everything else
// at least one optiona should be required
// only authenticated user
handlers._users.put = function (data, callback) {
    // check for the required field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false
    //check for the optional field
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim(): false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    // error if the phone invalid
    if (phone){
        // check if one of the optional fields are passed
        if (firstName || lastName || password){
            // get the token from header
            var token = typeof(data.headers.token) == 'string' ? data.headers.token: false
            handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
                if(tokenIsValid){
                    // lookup user
                    _data.read('users', phone, (err, userData)=> {
                        if(!err && userData){
                            //update what is necessary
                            if(firstName) {
                                userData.firstName = firstName
                            } if (lastName) {
                                userData.lastName = lastName
                            } if (password) {
                                userData.hashedPassword = helpers.hash(password)
                            }
                            // store the user
                            _data.update('users', phone, userData, (err)=>{
                                if(!err){
                                    callback(200, `user with ${phone} number successfully updated`)
                                }   else {
                                    console.log(err)
                                    callback(500)
                                }
                            })
                        }   else {
                            callback(400, {"error": "user doesnt exist"})
                        }
                    })
                } else {
                    callback(403, {'error': 'token is invalid or doesnt match the phone number'})
                }
            })
        }   else {
            callback(400, {"error": "missing fields to update"})
        }
    }   else {
        callback(400, {"error": "missing required field"})
    }
}

// users delete
// required data is phone
// optional none
// only authenticated user
// cleanup delete any other data files associated with this users
handlers._users.delete = function (data, callback) {
    // check phone num validation
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false
    if(phone){
        var token = typeof(data.headers.token) == 'string' ? data.headers.token: false
        handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
            if(tokenIsValid){
                 // lookup the user
                _data.read('users', phone, (err, data)=> {
                    if(!err && data){
                        _data.delete('users', phone, (err)=> {
                            if(!err){
                                var userChecks = typeof(data.checks) == 'object' && data.checks instanceof Array ? data.checks: []
                                var checksToDelete = userChecks.length
                                if(checksToDelete > 0){
                                    var checksDeleted = 0
                                    var deletionErrors = false
                                    userChecks.forEach(function(checkId){
                                        // delete the check
                                        _data.delete('checks', checkId, function(err){
                                            if(err){
                                                deletionErrors = true
                                            } else {
                                                checksDeleted++
                                                if(checksDeleted == checksToDelete){
                                                    if(!deletionErrors){
                                                        callback(200)
                                                    } else {
                                                        callback(500, {'error': 'errors encountered when deleting the checks'})
                                                    }
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    callback(200)
                                }
                            }   else {
                                callback(500, {"error": "couldnt delete the specified user"})
                            }
                        })
                    }   else {
                        callback(400, {"error": "couldnt find related suer"})
                    }
                })
            } else {
                callback(403, {'error': 'mismatching token or no token'})
            }
        })
    }   else {
        callback(400, {"error": "phone not valid"})
    }
}

// tokens
handlers.tokens = function(data,callback){
    acceptableMethods = ['post','get','put','delete']
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._tokens[data.method](data,callback)
    } else {
      callback(405, {'error': 'method not allowed'})
    }
};

// container for all the token methods
handlers._tokens = {}

// tokens post
// required data : phone, password
// optional data
handlers._tokens.post = function (data, callback){
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    if (phone && password){
        _data.read('users', phone, function(err, userData){
            if(!err && userData){
                // hash the password and validate
                hashedPassword = helpers.hash(password)
                if (hashedPassword == userData.hashedPassword) {
                    // if valid create token
                    var tokenId = helpers.createRandomString(20)
                    // set expiry date
                    var expires = Date.now() + 1000 * 60 * 60
                    var tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    }
                    // store the token
                    _data.create('tokens', tokenId, tokenObject, function(err){
                        if(!err){
                            callback(200, tokenObject)
                        } else {
                            callback(500, {'error': 'couldnt create new token'})
                        }
                    })
                }   else {
                    callback(400, {'error': 'passwords did not match'})
                }
            }   else {
                callback(400, {'error': 'couldnt find the user'})
            }
        })

    }   else {
        callback(400, {'error': 'missing required fields'})
    }
}

//tokens get
// required data is id
// optional is none
handlers._tokens.get = function (data, callback){
    // check the phone is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false
    if (id) {
        // lookup
        _data.read('tokens', id, function(err, tokenData){
            if(!err && tokenData){
                callback(200,tokenData)
            }   else {
                callback(404)
            }
        })
    } else {
        callback(400, {'Error': "missing required field"})
    }
}

//tokens delete
// required data id
// optional is none
handlers._tokens.delete = function (data, callback){
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim(): false
    if(id){
        _data.read('tokens', id, (err, data)=> {
            if(!err && data){
                _data.delete('tokens', id, function(err){
                    if(!err){
                        callback(200, {'message' : 'token successfulyy deleted'})
                    } else {
                        callback(500, {'error': 'could delete the requested token'})
                    }
                })
            } else {
                callback(400, {'error': 'token does not exist'})
            }
        })
    } else {
        callback(400, {'error': 'missing required fields'})
    }
}

//tokens put
// required fields: id, extend
// optional none
handlers._tokens.put = function (data, callback){
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? data.payload.extend : false
    if(id && extend){
        // lookup the token
        _data.read('tokens', id, function(err,tokenData){
            if(!err && tokenData){
                // check that token has not expired
                if(tokenData.expires > Date.now()){
                    tokenData.expires = Date.now() + 1000 * 60 * 60
                    // store the new updates
                    _data.update('tokens', id, tokenData, function(err){
                        if(!err){
                            callback(200,{'message': 'token successfully updated'})
                        } else {
                            callback(500, {'error': 'couldnt update the token'})
                        }
                    })
                } else {
                    callback(400, {'error': ' the token has already expired'})
                }
            } else {
                callback(400, {'error': 'specified token does not exist'})
            }
        })
    } else {
        callback(400, {'error': 'missing required fields'})
    }

}

// verify if a given tokenid is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback){
    // lookup the token
    _data.read('tokens', id, function(err, tokenData){
        if(!err && tokenData){
            // check that the token is for the given user and has not expired 
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

// checks
handlers.checks = function(data,callback){
    acceptableMethods = ['post','get','put','delete']
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._checks[data.method](data,callback)
    } else {
      callback(405, {'error': 'method not allowed'})
    }
};

// 
handlers._checks = {}

// post check method
// required data: protocol, url, method, succesCodes, timeoutSeconds
handlers._checks.post = function(data, callback){
    // validate inputs
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol: false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim(): false
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method: false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes: false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds: false

    if(protocol && url && method && successCodes && timeoutSeconds) {
        // get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false

        // lookup the user by reading the token
        _data.read('tokens', token, function(err, tokenData){
            if(!err && tokenData){
                var userPhone = tokenData.phone

                //lookup the user data
                _data.read('users', userPhone, function(err, userData){
                    if(!err && userData){
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks: []
                        // verify has less than the number of max checks per user
                        if(userChecks.length < config.maxChecks){
                            // create a random id
                            var checkId = helpers.createRandomString(20)
                            // create the check object, and include user phone
                            var checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            }

                            // save the object
                            _data.create('checks', checkId, checkObject, function(err){
                                if(!err){
                                    // add the check id to the users object
                                    userData.checks = userChecks
                                    userData.checks.push(checkId)
                                    // save the new user data 
                                    _data.update('users', userPhone, userData, function(err){
                                        if(!err){
                                            // return the data about the new check 
                                            callback(200, checkObject)
                                        } else {
                                            callback(500, {'error': 'could not update the user with the new checks'})
                                        }
                                    })
                                } else {
                                    callback(500, {'error': 'could not create the new check'})
                                }
                            })
                        } else {
                            callback(400, {'error': 'the user has the maximum number of checks ('+config.maxChecks+')'})
                        }
                    } else {
                        callback(403)
                    }
                })
            } else {
                callback(403)
            }
        })
    } else {
        callback(400, {'Error': 'missing required fields, or invalid inputs'})
    }
}

// get check method
// required data: id
// optional none
handlers._checks.get = function(data, callback){
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim(): false
    if(id) {
        // look up the check
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                // get the token from the headers
                var token = typeof(data.headers.token) == 'string' ? data.headers.token: false
                // verify that the token is valid and belongs to the user who created the token
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                    if(tokenIsValid){
                        // return the check data
                        callback(200, checkData)
                    } else {
                        callback(403)
                    }
                })
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, {'error': 'missing required field'})
    }
}

// delete check method
// required data: id
// no optional data
handlers._checks.delete = function(data, callback){
    // check that the id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim(): false
    if(id) {
        // look up the check
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                // get the token from the headers
                var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
                // verify the token
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                    if(tokenIsValid) {
                        // delete the check
                        _data.delete('checks', id, function(err){
                            if(!err){
                                // look up this user and modify their object
                                _data.read('users', checkData.userPhone, function(err, userData){
                                    if(!err && userData) {
                                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks: []
                                        // remove the deleted check from their list of checks
                                        var checkPosition = userChecks.indexOf(id)
                                        if(checkPosition>-1){
                                            userChecks.splice(checkPosition, 1)
                                            // re-save the users data
                                            _data.update('users', checkData.userPhone, userData, function(err){
                                                if(!err){
                                                    callback(200, userData)
                                                } else {
                                                    callback(500, {'error': 'could not update the specified user'})
                                                }
                                            })
                                        } else {
                                            callback(500, {'err': 'could not find the check from the users object, so could not remove it'})
                                        }
                                    } else {
                                        callback(500, {'error': 'could not find the specified user'})
                                    }
                                })
                            } else {
                                callback(500, {'error': 'could not delete the checl data'})
                            }
                        })
                    } else {
                        callback(403, {'error': 'missing required token in the header, or token is not valid'})
                    }
                })
            } else {
                callback(400, {'error': 'the check id does not exist'})
            }
        })
    } else {
        callback(400, {'error': 'missing required fields'})
    }
}

// put check method
// required data: id
// optional data: protocol, url, method, succescodes, timeoutseconds
handlers._checks.put = function(data, callback){
    // check the required field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim(): false
    // check the optional fields
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol: false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim(): false
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method: false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes: false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds: false
    // check to make sure id is valid
    if(id){
        if(protocol || url || method || successCodes || timeoutSeconds){
            // lookup the check
            _data.read('checks', id, function(err, checkData){
                if(!err && checkData){
                    // get the token from the headers
                    var token = typeof(data.headers.token) == 'string' ? data.headers.token: false
                    // verify that the given token is valid and belongs to the user who created it
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                        if(tokenIsValid){
                            //update the check 
                            if(protocol){
                                checkData.protocol = protocol
                            } if (url) {
                                checkData.url = url
                            } if (method){
                                checkData.method = method
                            } if (successCodes) {
                                checkData.successCodes = successCodes
                            } if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds
                            }

                            // store the update
                            _data.update('checks', id, checkData, function(err){
                                if(!err){
                                    callback(200, checkData)
                                } else {
                                    callback(500, {'error': 'could not update'})
                                }
                            })
                        } else {
                            callback(403)
                        }
                    })
                } else {
                    callback(400, {'error': 'check id does not exist'})
                }
            })
        } else {
            callback(400, {'error': 'no fields to update'})
        }
    } else {
        callback(400, {'error': 'missing required fields'})
    }
}

module.exports = handlers