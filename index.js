'use strict'

const chillPatch = (klass, func, optionalDescription) => {
  const symbol = Symbol(optionalDescription)
  klass.prototype[symbol] = function(){
    const args = Array.prototype.slice.call(arguments)
    args.unshift(this)
    return func.apply(null, args)
  }
  return symbol
};

module.exports = chillPatch
