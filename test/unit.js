/*
* Unit Tests
*/

//  dependencies
const helpers = require('../lib/helpers')
const assert = require('assert')
const logs = require('./../lib/logs')
const exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem')

//  holder for tests
let unit = {}

//  assert that the getNumber function is returning a number type
unit['helpers.getANumber should return a number type'] = (done) => {
    let val = helpers.getNumber()
    assert.equal(typeof(val), 'number')
    done()
}

//  assert that the getNumber function is returning a number 1
unit['helpers.getANumber should return 1'] = (done) => {
    let val = helpers.getNumber()
    assert.equal(val, 1)
    done()
}

//  assert that getNumber funciton is returning a number 2
unit['helpers.getNumber should return 2'] = (done) => {
    let val = helpers.getNumber()
    assert.equal(val, 2)
    done()
}

//  logs list should bring back array of lof names
unit['logs.list should callback a false error and an array of log names'] = (done) => {
    logs.list(true, (err, logFileNames)=>{
        assert.equal(err, false)
        assert.ok(logFileNames instanceof Array)
        assert.ok(logFileNames.length > 1)
        done()
    })
}

//  logs truncate should not throw an error
unit['logs truncate should not throw if the logid doesnt exits. it should callback an error instead'] = (done) => {
    assert.doesNotThrow(()=>{
        logs.truncate('I do not exist', (err)=>{
            assert.ok(err)
            done()
        })
    }, TypeError)
}

//  logs truncate should throw an error
unit['exampleDebugging problem.init should no throw when called'] = (done) => {
    assert.doesNotThrow(()=>{
        exampleDebuggingProblem.init()
        done()
    }, TypeError)
}

//  export the tests to the runner
module.exports = unit