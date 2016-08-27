const chillPatch = require('./index.js')
const should = chillPatch(Object, require('should/as-function'))

const foo = {a: 2}

foo[should]().deepEqual({a: 2})

const exceptions = []

try {
  foo[should]().deepEqual({a: 3}) // fails
}
catch(exception){
  exceptions.push(exception)
}

exceptions[should]().have.length(1)
