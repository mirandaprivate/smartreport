# I18n Usage

## Create jsonnet

The jsonnet file records all translations organized with tree struct. Use
`i18n.libsonnet` to write this jsonnet file.
There are two types of node in this tree.

- Internal node

Create it by `i18n.Node`. It includes a `name` string and a `deps` list which
contains subnodes or translations node.

```jsonnet
local row = i18n.Node(name='row', deps = [foo, bar])
```

- Translations node

Create it by `118n.Translations`. It includes a `name` string and a `pack` which
created by `i18n.Pack`. Pack contains all translations of this node.

```jsonnet
local foo = i18n.Translations(name='foo', pack=i18n.Pack(
    en_us='foo',
    zh_cn='负',
    zh_hk='負',
))
```

Learn more example about jsonnet at `./test/foo.jsonnet`.

## Create BUILD

After create the jsonnet file, you can use it in ts code through the bazel rules
below.

```bzl
ts_library(
    name = 'bar',
    srcs = ['bar.ts'],
    deps = [':foo'],
)

ts_i18n_library(
    name = 'foo',
    src = ':foo_json',
)

jsonnet_to_json(
    name = 'foo_json',
    deps = ['//src/app/assets/i18n'],
    src = 'foo.jsonnet',
    outs = ['foo.json],
)
```

## Create ts code

You can import the generate i18n ts code by the `@logi-i18n` prefix.

```ts
import {I18n, Locale} from '@logi-i18n/.../foo'

function foo(): void {
    /**
     * Default locale is EN_US.
     */
    const i18n = new I18n()
    console.log(i18n.row.foo === 'foo')
    /**
     * Set ZN_CN locale.
     */
    i18n.setLocale(Locale.ZH_CN)
    console.log(i18n.row.foo === '负')
    /**
     * Create i18n with specific locale
     */
    const i18nNew = new I18n(Locale.ZH_HK)
    console.log(i18nNew.row.foo === '負')
}

```

Learn more example about i18n at `examples/angular/samples/components/i18n`.
