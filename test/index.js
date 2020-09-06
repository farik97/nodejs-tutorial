/*
* test runner
*
*/


//  application logic for the test runner
_app = {}

_app.tests = {}

_app.tests.unit = require('./unit')

_app.countTests = () => {
    let counter = 0
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key]
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++
                }
            }
        }
    }
    return counter
}

_app.produceTestReport = (limit, successes, errors) => {
    console.log("")
    console.log("---------Begin test report--------")
    console.log("")
    console.log("Total Tests:", limit)
    console.log("Pass:", successes)
    console.log("Fail: ", errors.length)
    console.log("")
    //  if errors print them in detail
    if (errors.length > 0) {
        console.log("---------Begin Error details--------")
        console.log("")

        errors.forEach((testError)=>{
            console.log('\x1b[31m%s\x1b[0m', testError.name)
            console.log(testError.error)
            console.log("")
        })

        console.log("")
        console.log("---------End test report--------")
    }
    
    console.log("")
    console.log("---------End test report--------")
}

//  run all the tests, collecting the errors and successes
_app.runTests = () => {
    let errors = []
    let successes = 0
    let limit = _app.countTests()
    let counter = 0
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key]
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (() => {
                        let tmpTestName = testName
                        let testValue = subTests[testName]
                        //  call the test
                        try {
                            testValue (()=>{
                                //  if calls back without throwing then it succeded, so log it green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName)
                                counter++
                                successes++
                                if (counter == limit) {
                                    _app.produceTestReport(limit, successes, errors)
                                }
                            })
                        } catch(e) {
                            //  if throws then failed
                            errors.push({
                                'name': testName,
                                'error': e
                            })
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName)
                            counter++
                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors)
                            }
                        }
                    })()
                }
            }
        }
    }
}

_app.runTests()