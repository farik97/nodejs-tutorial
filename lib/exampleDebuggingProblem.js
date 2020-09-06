/*
*   Library that demonstrates throwing when its init() is called
*
*/

//  contaner for the module

let example = {}

example.init = () => {
    let foo = bar
}

module.exports = example