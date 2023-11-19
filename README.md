# object-selectors

This package helps access and manipulate data in deeply nested Javascript objects more comfortably using an easy and powerful notation.

I.e. instead of this

    for (let prop in obj.a)
      if (/b\w*/.test(prop) &&  obj.a[prop].c === 'foo')
        obj.a[prop].c = 'bar'

you can simply write

    set('a.b*[c === foo].c', obj, 'bar')


&NewLine;  
&NewLine;  

>  :information_source: **Note**: This is version 2.0 of this package. It introduces the following breaking changes:
> - `apply` was renamed to `perform`
> - The empty selector now selects the input object instead of nothing.


## Table of contents

[Usage](#usage)

[Notation](#notation)

[Examples](#examples)

[API](#api)

[Performance considerations](#performance-considerations)

[Security considerations](#security-considerations)

## Usage

Install with

    npm install object-selectors

Use as follows:

    import { get, set } from 'object-selectors';

    const obj = {
      a: {
        b1: { c: 1  },
        b2: { c: 2  }
    }

    get('a.b*.c', obj); // [ 1, 2 ]
    set('a.b*.c', obj, 'c'); [ 'c', 'c' ]
    get('a.b*.c', obj); // [ 'c', 'c' ]

## Definitions

### Ambiguous vs. unambiguous selectors

A selector is called **ambiguous** if it may result in more than one property being selected. This is, most commonly, the case when using wildcards.

A selector is called **unambiguous** if it may only ever result in at most one property being selected.

Note that ambiguity is a property of the selector itself, independent the results of applying that selector to any particular object.

### Empty selector

The empty string `''` is called the **empty** selector. By definition, it selects the input object.

## Notation

`object-selectors` comes with its own selector language that takes elements from Javascript notation, file globs and CSS selectors and combines them into the powerful notation outlined below.

### Basics

Allowed characters in property names and values are `[A-Za-z0-9_]`. All other characters must be **escaped** with a backslash (`\`). Be aware that when specifying selectors as string literals in Javascipt, you will need to use a double backslash, as otherwise the backslash itself will be treated as an escape character by Javascript.

### Nested access

A nested property is accessed by preceding it with a dot (`.`).

### Wildcards

Properties may include wildcards (`*`, `?`) which follow the familiar semantics of file globs:

*   The asterisk (`*`) matches 0 or more arbitrary characters
*   The question mark (`?`) matches exactly 1 arbitrary character

Using a wildcard always results in an ambiguous selector.

### Conditional selection

Properties may be succeeded by any number of conditions. Conditions are expressions constraining the selected properties according to their values. Conditions are either **unary** (<code>\[ <i>properties</i> ]</code>) or **binary** (<code>\[ <i>properties</i> <i>operator</i> <i>value</i> ]</code>). There may be spaces between the square brackets and between the *`properties`*, *`operator`* and *`value`* part.

The properties checked by the condition are themselves expressed as selectors, and thus have access to all the features described in this document, i.e. they may contain nested access, wildcards and even conditions themselves. If a selector is ambiguous, it is considered satisfied if it is satisfied for *all* the matching properties. Note that using an ambiguous selector in a condition does not make its
parent selector ambiguous.

A unary condition is satisfied if the value of the specified property is truthy. A binary condition is satisfied if the result of applying the specified *`operator`* to value of the specified *`property`* and the specified *`value`* is truthy.

Values may be a **reference** to a value passed in the `references` object. References begin with a `@`, e.g. `@foo`. When the condition is evaluated, the reference is replaced with the value for the referenced property from the references object.

*`operator`* may be one of the following:

Operator | Condition looks like | Meaning
:--- | :--- | :---
`==` | `a == b` | The value of property `a` is loosely equal to `b`
`===` | `a === b` | The value of property `a` is strictly equal to `b`
`^=` | `a ^= b` | The value of property `a` starts with `b`: `a.startsWith(b)`
`$=` | `a $= b` | The value of property `a` ends with `b`: `a.endsWith(b)`
`~=` | `a ~= b` | The value of property `a` satisifies regular expression `b`: `new RegExp(b).test(a)`
`<` | `a < b` | The value of property `a` is strictly less than `b`
`<=` | `a <= b` | The value of property `a` is less than or equal to `b`
`>=` | `a >= b` | The value of property `a` is greater than or equal to `b`
`>` | `a > b` | The value of property `a` is strictly greater than `b`

## Examples

    const obj = {
      a: {
        b1: { c: 1  },
        b2: { c: 2  }
    }

    // Access property c of property b1 of property a of obj
    get('a.b1.c', obj) // 1

    // Access any property starting with c on obj.a.b1
    get('a.b1.c*', obj) // [ 1 ]

    // Access any property starting with c and followed by exactly one arbitrary character on obj.a.b1
    get('a.b1.c?', obj) // [], because there is no such property

    // Access all properties on obj.a
    get('a.*', obj) // [ { c: 1 }, { c: 2 }

    // Access any property on obj.a which itself has a property c that loosely equals 1
    get('a.*[c == 1], obj) // [ { c: 1 } ]

    // For any property on obj.a which itself has a property c that loosely equals 1, access that property
    get('a.*[c == 1].c, obj) // [ 1 ]

    // Access any property on obj.a which itself has a property c that strictly equals 1
    get('a.*[c === 1], obj) // [], because literal values in conditions are strings

    // Access any property on obj.a which itself has a property c that strictly equals the value of property val on the reference object
    get('a.*[c === @val], obj, { val: 1 }) // [ 1 ] 

    // Empty selector
    get('', obj) // obj

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### compile

Compiles the given `selector`. The compiled selector can be passed to `perform`, `get`, and `set` instead of the original string.
If you intend to re-use a given selector for multiple operations, pre-compiling it gives a performance boost.

The returned compiled selector also has methods `perform`, `get`, and `set`, so instead of calling `get(compiledSelector, obj)` you can
also do `compiledSelector.get(obj)`.

#### Parameters

*   `selector` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The selector to compile.

Returns **Selector** The compiled selector.

### perform

This is the fundamental function used to manipulate object properties with selectors.
In its most basic form, it takes a selector `selector`, a function `fn` and a target object `obj` and applies `fn` to all properties
in `obj` described by `selector`. If the result of the function application is different form the property's current value,
it will be updated accordingly.

`perform` returns the results of the function application. If the used `selector` is ambiguous, the results are returned as an array.
If it is unambiguous, the result is returned as a scalar. `options.collate` can be used to force one behavior or the other:

*   Setting `options.collate` to `false` will *always* return an array, even if there is only one result.
*   Setting `options.collate` to `true` will check that all results are deeply equal, and if they are, return their value as a scalar.
    If the results are not all deeply equal, an error will be thrown. (Note that the function will still have been applied, though.)

*Note: In versions prior 2.0, this function was called `apply`. This has been changed to `perform` to avoid a name conflict with
`Function.prototype.apply` in compiled selectors.*

#### Parameters

*   `selector` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Selector)** The selector describing the properties to perform the function to. This can either be a string, or
    a pre-compiled selector (see [compile](#compile)).
*   `fn` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The function to perform.
*   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The object on whose properties to perform the function.
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** An optional object with further options for the operation

    *   `options.collate` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Whether to collate the results or not. Defaults to `true` on unambiguous selectors, and to `false` on ambiguous ones.
    *   `options.references` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The values for any references used in the selector.

Returns **any** The results of applying `fn` to all selected properties.

### get

*   **See**: perform

Gets the values of the properties described by `selector` from `obj`. No properties are changed.
Otherwise, this function follows the same rules as [perform](#perform).

#### Parameters

*   `selector` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Selector)** The selector describing the properties to get. This can either be a string, or
    a \[pre-compiled selector][compile](#compile).
*   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The object whose properties to get.
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** An optional object with further options for the operation

    *   `options.collate` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Whether to collate the results or not. Defaults to `true` on unambiguous selectors, and to `false` on ambiguous ones.
    *   `options.references` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The values for any references used in the selector.

Returns **any** The values of the selected properties.

### set

*   **See**: perform

Sets the values of the properties described by `selector` from `obj` to `value`.
Otherwise, this function follows the same rules as [perform](#perform).

#### Parameters

*   `selector` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Selector)** The selector describing the properties to set. This can either be a string, or
    a \[pre-compiled selector][compile](#compile).
*   `obj` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The object whose properties to set.
*   `value` **any** The new value for the properties.
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** An optional object with further options for the operation

    *   `options.collate` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Whether to collate the results or not. Defaults to `true` on unambiguous selectors, and to `false` on ambiguous ones.
    *   `options.references` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The values for any references used in the selector.

Returns **any** The new values of the selected properties. Unless collating, the length of the result gives an indication of
how many properties matched the selector.

## Performance considerations

There are a few other libraries that do the same thing, although none offer the features and expressive powers of this one. In particular, none allow using wildcards in selectors, conditions, or application of arbitrary functions - that's why I wrote this in the first place. That power comes at a price, though, and that price is speed. Below are benchmark results comparing `object-selectors` with some of the competitors.

Library | ops/sec
\---|---:
object-selectors (string selector, collation auto) | 91,700 ops/sec ±10.38% (85 runs sampled)
object-selectors (pre-compiled, collation auto) | 1,041,568 ops/sec ±2.11% (90 runs sampled)
object-selectors (pre-compiled, collation off) | 1,183,696 ops/sec ±1.58% (87 runs sampled)
[easy-object-selector](https://github.com/deltavi/easy-object-selector) | 4,080,250 ops/sec ±1.58% (93 runs sampled)
[object-path](https://github.com/mariocasciaro/object-path) | 997,770 ops/sec ±6.47% (81 runs sampled)
[dot-prop](https://github.com/sindresorhus/dot-prop) | 3,310,430 ops/sec ±8.16% (70 runs sampled)
[pathval](https://github.com/chaijs/pathval) | 275,348 ops/sec ±4.44% (64 runs sampled)
[getvalue](https://github.com/jonschlinkert/get-value) | 2,342,407 ops/sec ±3.62% (84 runs sampled)

The key take aways:

1.  If you only need to access simple nested properties in objects and performance is a concern, you should probably go with a different library.
2.  Pre-compiling a repeatedly-used selector gives a performance gain of about factor 100.

## Security considerations

This package is based on a technique called *parsing expression grammar* (PEG) using [Peggy](https://peggyjs.org/) to parse and evaluate selectors. It does not use `eval`, and is therefore safe from the security concerns around code injection arising from it. This means it is safe to pass user content as selectors for read-only operations.

⚠️ In write operations, using unsanitized user input for both selector and value at the same time opens up a vector for arbitrary code execution. See [The Dangers of Square Bracket Notation](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/the-dangers-of-square-bracket-notation.md).
