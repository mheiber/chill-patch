const assertEq = require('assert').equal
const chillPatch = require('./index.js')

const lastFunc = arr => arr[arr.length - 1]

const test = () => {
  const last = chillPatch(Array, lastFunc, 'last')
  const actual = [1, 2, 3][last]()
  const expected = 3
  assertEq(actual, expected, 'Safely patches a class')
}

test()
console.log('success')
