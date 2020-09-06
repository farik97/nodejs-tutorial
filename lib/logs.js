/*
*   library for log functions
*/

// Dependencies
var fs = require('fs')
var path = require('path')
var zlib = require('zlib')

// container for the library
var lib = {}

lib.baseDir = path.join(__dirname, '/../.logs/')

// append a string to a file. create a file if it doesn't exist
lib.append = (file, str, callback) => {
    
    // open for appending
    fs.open(lib.baseDir+file+'.log', 'a', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            
            // append to the file and close it
            fs.appendFile(fileDescriptor, str+'\n', (err)=> {
                if (!err) {
                    fs.close(fileDescriptor, (err)=>{
                        if (!err) {
                            callback(false)
                        } else {
                            callback('error closing the file')
                        }
                    })
                } else {
                    callback('error appending the file')
                }
            })

        } else {
            callback('could not open file for appending')
        }
    })
}

// list the log files
lib.list = (includeCompressedLogs ,callback) => {
    fs.readdir(lib.baseDir, (err, data)=>{
        if(!err && data && data.length >0) {
            let trimmedFileNames = []
            data.forEach((fileName)=>{
                
                // add the log files
                if(fileName.indexOf('.log')>-1){
                    trimmedFileNames.push(fileName.replace('.log', ''))
                }

                // add on the .gz
                if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''))
                }

            })
            callback(false, trimmedFileNames)       
        } else {
            callback(`error: ${err}, data: ${data}`)
        }
    })
}

// Compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress = function(logId,newFileId,callback){
    var sourceFile = logId+'.log';
    var destFile = newFileId+'.gz.b64';
  
    // Read the source file
    fs.readFile(lib.baseDir+sourceFile, 'utf8', function(err,inputString){
      if(!err && inputString){
        // Compress the data using gzip
        zlib.gzip(inputString,function(err,buffer){
          if(!err && buffer){
            // Send the data to the destination file
            fs.open(lib.baseDir+destFile, 'wx', function(err, fileDescriptor){
              if(!err && fileDescriptor){
                // Write to the destination file
                fs.writeFile(fileDescriptor, buffer.toString('base64'),function(err){
                  if(!err){
                    // Close the destination file
                    fs.close(fileDescriptor,function(err){
                      if(!err){
                        callback(false);
                      } else {
                        callback(err);
                      }
                    });
                  } else {
                    callback(err);
                  }
                });
              } else {
                callback(err);
              }
            });
          } else {
            callback(err);
          }
        });
  
      } else {
        callback(err);
      }
    });
  };

// decompress the log files
lib.decompress = (fileId, callback) => {
    let fileName = fileId+'gz.b64'
    fs.readFile(lib.baseDir+fileName, 'utf8', (err, str)=>{
        if (!err && str) {
            let inputBuffer = Buffer.from(str, 'base64')
            zlib.unzip(inputBuffer, (err, outputBuffer)=>{
                if(!err && outputBuffer){
                    let str = outputBuffer.toString()
                    callback(false, str)
                } else {
                    callback(err)
                }
            })
        } else {
            callback(err)
        }
    })
}

// truncating a log file
lib.truncate = (logId, callback) =>{
    fs.truncate(lib.baseDir+logId+'.log', 0, (err)=>{
        if (!err) {
            callback(false)
        } else {
            callback(err)
        }
    })
}


// export the library
module.exports = lib