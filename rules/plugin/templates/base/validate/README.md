# Validate

Validation is based on the rules at
[protoc-gen-validate](https://github.com/envoyproxy/protoc-gen-validate).

## Implementation way

We use the npm `class-validator` to validate in generated ts code. It uses
decorators to support validation.

For example:

```proto
Message Foo {
    int32 bar = 1 [(validate.rules).int32.const = 1];
}
```

```ts
import {Equals} from 'class-validator'

interface Foo {
    bar: number
    validate(): readonly Exceptions[]
}

class FooImpl implements<Foo> {
    @Equals(1)
    bar: number = 0

    public validate(): readonly Exceptions[] {...}
}
```

Then you can call the `validate()` function to get the validated result.

## Implemented rules

(1) Number

- const
- lt/lte/gt/gte
- in/not_in

(2) Boolean

- const

(3) String

- const
- len/min_len/max_len
- min_bytes/max_bytes
- prefix/suffix/contains/not_contains
- in/not_in
- email
- ip/ipv4/ipv6
- uri/uri_ref
- uuid
- pattern

    Pattern is required [RE2](https://github.com/google/re2/wiki/Syntax) format.
But ts only support `RegExp` in browser. Since `RE2`  is almost a superset of
`RegExp`(see [this](https://www.npmjs.com/package/re2])), we use `RegExp` in ts
to parse `RE2` format pattern. You'd better use `RegExp` format for `pattern`
field or it may not work correctly.

(4) Bytes

- const
- len/min_len/max_len
- pattern
- prefix/suffix/contains
- in/not_in
- ip/ipv4/ipv6

(5) Enum

- const
- defined_only
- in/not_in

(6) Message

- skip
- required

(7) Repeated

- min_items/max_items
- unique
- items

(8) Map

- min_pairs/max_pairs
- no_sparse
- values

(9) Well-Known Types

- any
- timestamp

(10) Message-Global

-disable

(11) OneOf

- required

## Unimplemented rules

(1) String

- address
- hostname
- well_known_regex

(2) Map

- keys

    We use `class-validator` in ts to validate. But it doesn't offer a good API
to validate keys in map.

(3) Well-Known Types

- Duration

    We doesn't use duration in out repository at present.

- Wrapper

    It aims to  distinguish between unset and the zero value of a scalar field.
We doesn't need this function at present.
