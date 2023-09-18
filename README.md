# object-selectors

This package helps access and manipulate data in deeply nested Javascript objects more comfortably using an easy and powerful notation.

I.e. instead of this

    for (let prop in obj.a)
      if (/b\w*/.test(prop) &&  obj.a[prop].c === 'foo')
        obj.a[prop].c = 'bar'

you can simply write

    set('a.b*[c === foo].c', obj, 'bar')

## Table of contents

[Usage](#usage)

[Notation](#notation)

[Examples](#examples)

[API](#api)

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
    get('a.b1.c', obj) // [ 1 ]

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

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Security considerations

This package is based on a technique called *parsing expression grammar* (PEG) using [Peggy](https://peggyjs.org/) to parse and evaluate selectors. It does not use `eval`, and is therefore safe from the security concerns around code injection arising from it. This means it is safe to pass user content as selectors for read-only operations.

⚠️ In write operations, using unsanitized user input for both selector and value at the same time opens up a vector for arbitrary code execution. See [The Dangers of Square Bracket Notation](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/the-dangers-of-square-bracket-notation.md).
