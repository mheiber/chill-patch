[![http://chillestmonkey.com](http://chillestmonkey.com/img/monkey.gif)](http://chillestmonkey.com/)

# chill-patch: Stress-free Monkey Patching for JavaScript

chill-patch enables you to add methods to JS classes safely, with none of the [problems of traditional monkey-patching](https://medium.com/@maxheiber/safe-monkey-patching-with-es2015-symbol-e36fb01ab794#.bzbb99m69).

```js
const chillPatch = require('chill-patch')
const lastFunc = arr => arr[arr.length - 1]
const array = [1, 2, 3]

// safely add a method to `Array`
const last = chillPatch(Array, lastFunc, 'last')

// call the new method!
array[last]() //=> 3
```

You can use `chill-patch` to use off-the-shelf `this`-less functions as methods:

```js
// Using toggle-set without chill-patch
const toggleSet = require('toggle-set')
const set = new Set([1, 2, 3])

toggleSet(set, 1) // Set([2, 3])

// Using toggle-set with chill-patch
const toggle = chillPatch(Set, toggleSet)

set[toggle](4) // Set([1, 2, 3, 4])

```

## Install

`npm install chill-patch`

## Uses

- Method-chaining-style syntax:
```js

// can adapt functions like this:
func3(func2(func1(instance)))

// and chain them like this:

instance
    [func1]()
    [func2]()
    [func3]()

// which is very similar to method chaining
instance
    .method1()
    .method2()
    .method3()
```

- testing

```js
const chillPatch = require('chill-patch')
const should = chillPatch(Object, require('should/as-function'))
const foo = {a: 2}
foo[should]().deepEqual({a: 2}) // succeeds
foo[should]().deepEqual({a: 3}) // fails
```

## API

```js
chillPatch(Klass, func, optionalDescription)
```

- `Klass` is an ES5-style or ES2015-style class
- `func` is a function with any number of arguments
- `optionalDescription` is used as the [`description` of the symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Parameters).

## Why it's Safe

`chill-patch` is safe because the return value is a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) and symbols are guaranteed to be unique. That means that the only way to access the new method you created is to have access to the symbol. 

> The only way another programmer can get access to symbols on an object in another scope is if they are [hellbent on doing so](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), in which case they know they are going off-roading.

When you add a property to a prototype using a symbol, it's hidden, so you can safely pass off the patched object to other parts of the codebase, without other programmers knowing its there or being affected by it.

```js
// after the above code is run, there is no change to the `ownPropertyNames` of the patched class

Object.getOwnPropertyNames(Array.prototype) // doesn't include anything new!

```

## Similar Tech in other Languages

- Scala [Implicit Conversions](http://docs.scala-lang.org/tutorials/tour/implicit-conversions)

- Objective-C [Categories](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html)

- Haskell [Typeclasses](http://learnyouahaskell.com/types-and-typeclasses#typeclasses-101) and Rust [Traits](https://blog.rust-lang.org/2015/05/11/traits.html)

- Nim [method call syntax](http://nim-lang.org/docs/manual.html#procedures-method-call-syntax)

## Something Better

The [JavaScript Pipeline Operator proposal](https://github.com/mindeavor/es-pipeline-operator) accomplishes the same syntactic convenience more simply and elegantly. The following two expressions would be equivalent:

```js
let result = exclaim(capitalize(doubleSay("hello")));
result //=> "Hello, hello!"

let result = "hello"
  |> doubleSay
  |> capitalize
  |> exclaim;

result //=> "Hello, hello!"
```
> *from [the pipeline operator proposal](https://github.com/mindeavor/es-pipeline-operator#introduction)*

The Pipeline Operator [is from F#](https://docs.microsoft.com/en-us/dotnet/articles/fsharp/language-reference/functions/index#function-composition-and-pipelining), is [also implemented in Elm](http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#|>) and is similar to Clojure's [threading macro](http://clojure.org/guides/threading_macros).