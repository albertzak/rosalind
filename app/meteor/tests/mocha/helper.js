require('babel-polyfill')

var chai = require('chai')

chai.use(require('chai-datetime'))

global.expect = chai.expect
