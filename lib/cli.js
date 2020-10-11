/*
* CLI related tasks
*
*/

//  dependencies
const readLine = require('readline')
const util = require('util')
const debug = util.debuglog('cli')
const events = require('events')
const _data = require('./data')
const _logs = require('./logs')
const helpers = require('./helpers')
class _events extends events{}
const e = new _events()
const os = require('os')
const v8 = require('v8')
const childProcess = require('child_process')

//  instantiate the clie objects

const cli = {}

//  input handlers
e.on('man', ()=>{
    cli.responders.help()
})

e.on('help', (str)=>{
    cli.responders.help()
})

e.on('exit', (str)=>{
    cli.responders.exit()
})

e.on('stats', (str)=>{
    cli.responders.stats()
})

e.on('list users', (str)=>{
    cli.responders.listUsers()
})

e.on('more user info', (str)=>{
    cli.responders.moreUserInfo(str)
})

e.on('list checks', (str)=> {
    cli.responders.listChecks(str)
})

e.on('more check info', (str)=> {
    cli.responders.moreCheckInfo(str)
})

e.on('list logs', (str)=>{
    cli.responders.listLogs()
})

e.on('more log info', (str)=>{
    cli.responders.moreLogInfo(str)
})

//  responders to events
cli.responders = {}

//  help / man 
cli.responders.help = () => {
    let commands = {
        'man': 'get this help console', 
        'help': 'get this help console', 
        'exit': 'Kill the CLI and the rest of the application', 
        'stats': 'get the statistics underlying the operating systems', 
        'list users': 'list the users in the system', 
        'more user info --{userId}': 'list more info on a specific user', 
        'list checks --up --down': 'list the checks in the system', 
        'more check info --{checkId}': 'list more info on a specific check', 
        'list logs': 'list all the logs in the system', 
        'more log info --{fileName}': 'list more info on a specific log'
    }

    //  show a header for the help page as wide as the screen
    cli.horizontalLine()
    cli.centered('CLI MANUAL')
    cli.horizontalLine()
    cli.verticalSpace(2)

    //  show each command, followed by its explanation, in white and yellow respectively
    for (let key in commands) {

        if (commands.hasOwnProperty(key)) {
            var value = commands[key]
            var line = '\x1b[33m'+key+'\x1b[0m'
            var padding = 60 - line.length
            for (i=0; i< padding; i++) {
                line += ' '
            }
        }

        line += value
        console.log(line)
        cli.verticalSpace()

    }

    cli.verticalSpace(1)
    cli.horizontalLine()

}

//  create vertical space
cli.verticalSpace = (num) => {
    let lines = typeof(num) == 'number' && num > 0 ? num : 1
    for (i=0; i<lines; i++) {
        console.log('')
    }
}

//  create horizontal line 
cli.horizontalLine = () => {
    //  get the available screen size
    let width = process.stdout.columns

    let line = ''

    for (i = 0; i < width; i++) {
        line += '-'
    }

    console.log(line)

}

cli.centered = (param) => {
    let str = typeof(param) == 'string' && param.trim().length > 0 ? param.trim() : ''

    //  get the available screen size
    let width = process.stdout.columns

    //  calculate the left padding there should be
    let leftPadding = Math.floor((width - str.length) / 2)

    //  put in left padded spaces before the string itself
    let line = ''
    for (i = 0; i < leftPadding; i++) {
        line += ' '
    }

    line += str
    console.log(line)
}

//  exit
cli.responders.exit = () => {
    process.exit(0)
}

//  stats
cli.responders.stats = () => {
    
    //  compile an object of stats
    let stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size)*100) + " %",
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit)*100) + " %",
        'Uptime': os.uptime()+ ' Seconds'
    }



    //  create a header for the stats
    cli.horizontalLine()
    cli.centered('SYSTEM STATISTICS')
    cli.horizontalLine()
    cli.verticalSpace(2)

    //  log out each stat
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            var value = stats[key]
            var line = '\x1b[33m'+key+'\x1b[0m'
            var padding = 60 - line.length
            for (i = 0; i < padding; i++) {
                line += ' '
            }
            line += value
            console.log(line)
            cli.verticalSpace()
        }
    }

    cli.verticalSpace(1)

    cli.horizontalLine()
}

//  list users
cli.responders.listUsers = () => {
    _data.list('users', (err, userIds)=> {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace()
            userIds.forEach((userId)=>{
                _data.read('users', userId, (err, userData)=>{
                    if (!err && userData) {
                        let line = 'Name: ' + userData.firstName+ ' ' + userData.lastName + ' Phone: ' + userData.phone+ ' Checks: '
                        let numOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0
                        line += numOfChecks
                        console.log(line)
                        cli.verticalSpace()
                    }
                })
            })
        }
    })
}

//  more user info
cli.responders.moreUserInfo = (str) => {
    let arr = str.split('--')
    let userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false
    if (userId) {
        _data.read('users', userId, (err, userData)=>{
            if (!err && userData) {
                delete userData.hashedPassword
                cli.verticalSpace()
                console.dir(userData, {'colors': true})
                cli.verticalSpace()
            } else {
                console.log('x1b[31m%s\x1b[0m', 'User id sent wasnt found')
            }
        })
    } else {
        console.log('\x1b[31m%s\x1b[0m','The userId sent doesnt pass the validation use help command for more info')
    }
}

//  list checks
cli.responders.listChecks = (str) => {
    _data.list('checks', (err, checks)=>{
        if (!err && checks && checks.length > 0) {

            cli.verticalSpace()
            
            checks.forEach((check)=>{
            
                _data.read('checks', check, (err, checkData)=>{
            
                    if (!err && checkData) {
            
                        let includeCheck = false
                        let lowerString = str.toLowerCase()
                        //  get the state, default to down
                        let state = typeof(checkData.state) =='string' ? checkData.state : 'down'
                        let stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown'

                        //  if the user has specified the state, or hasnt specified any state, include the check
                        if (lowerString.indexOf('--'+state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {

                            let line = 'ID: '+checkData.id + ' ' + checkData.method.toUpperCase() + ' ' + checkData.protocol + '://' + checkData.url+ ' State:' + stateOrUnknown
                            console.log(line)
                            cli.verticalSpace()
                            
                        }
            
                    }
                })
            })
        } else {
            console.log('\x1b[34m%s\x1b[0m', 'No checks to list')
        }
    })
}

//  more check info
cli.responders.moreCheckInfo = (str) => {
    let arr = str.split('--')
    let checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false
    if (checkId) {
        _data.read('checks', checkId, (err, checkData)=>{
            if (!err && checkData) {
                cli.verticalSpace()
                console.dir(checkData, {'colors': true})
                cli.verticalSpace()
            } else {
                console.log('x1b[31m%s\x1b[0m', 'Check id sent wasnt found')
            }
        })
    } else {
        console.log('\x1b[31m%s\x1b[0m','The checkId sent doesnt pass the validation use help command for more info')
    }
}

//  list logs
cli.responders.listLogs = () => {
    const ls = childProcess.spawn('ls', ['./.logs/'])
    ls.stdout.on('data', (dataObject)=>{
        //  explore into seperate lines
        let dataStr = dataObject.toString()
        let logFileNames = dataStr.split('\n')
        cli.verticalSpace()
        logFileNames.forEach((logFileName)=>{
            if (typeof(logFileName) == 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1) {
                console.log(logFileName.trim().split('.')[0])
                cli.verticalSpace()
            }
        })
    })
}

// More logs info
cli.responders.moreLogInfo = function(str){
    // Get logFileName from string
    var arr = str.split('--');
    var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(logFileName){
      cli.verticalSpace();
      // Decompress it
      _logs.decompress(logFileName,function(err,strData){
        if(!err && strData){
          // Split it into lines
          var arr = strData.split('\n');
          arr.forEach(function(jsonString){
            var logObject = helpers.parseJsonToObject(jsonString);
            if(logObject && JSON.stringify(logObject) !== '{}'){
              console.dir(logObject,{'colors' : true});
              cli.verticalSpace();
            }
          });
        }
      });
    }
};

cli.processInput = (str) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false
    if (str) {
        //  codify the unique string
        let uniqueInputs = ['man', 'help', 'exit', 'stats', 'list users', 'more user info', 'list checks', 'more check info', 'list logs', 'more log info']

        let matchFound = false
        let counter = 0
        uniqueInputs.some((input)=>{
            if (str.toLowerCase().indexOf(input)>-1){
                matchFound = true
                e.emit(input, str)
                return true
            }
        })

        //  if no match is found, user try again
        if(!matchFound) {
            console.log('sorry try again')
        }
    } else {

    }
}

cli.init = () => {

    //  send start message to the console
    console.log('\x1b[36m%s\x1b[0m', "The CLI is running")

    //  start the interface
    const _interface = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    })

    //  create an initial prompt
    _interface.prompt()

    //  handle each line of input seperately
    _interface.on('line', (str)=>{
        //  send to the input processor
        cli.processInput(str)

        // re-initialize the prompt
        _interface.prompt()
    })

    // if stop the cli
    _interface.on('close', ()=>{
        process.exit(0)
    })


}

module.exports = cli