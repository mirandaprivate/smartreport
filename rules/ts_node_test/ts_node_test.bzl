'''
Convenience rule for testing .ts libraries.
'''

load(
    '@npm//@bazel/jasmine:index.bzl',
    'jasmine_node_test',
)
load(
    '//rules:ts_library.bzl',
    'ts_library',
)
load(
    '//rules/binary_wrapper:binary_wrapper_test.bzl',
    'binary_wrapper_test',
)
load(
    '//rules:function.bzl',
    'function',
)

def ts_node_test(
        name,
        srcs = [],
        deps = [],
        tags = [],
        templated_args = [],
        size = 'small',
        vendor = False,
        **kargs,
    ):
    '''Test a ts library from within nodejs, with reasaonble defaults.

    Doc:
    https://github.com/bazelbuild/rules_nodejs/blob/stable/docs/Jasmine.md#jasmine_node_test

    Args:
        vendor: Wrappeer the rule, not use the original rule, if use
            binary wrapper, it can make the bianry run stripped from bazel.
    '''
    lib_name = '_%s_lib' % name
    deps = deps + [
        '@npm//@types/jasmine',
        '@npm//jasmine',
    ]
    common_args = function.get_common_args(**kargs)
    ts_library(
        name = lib_name,
        srcs = srcs,
        deps = deps,
        tags = tags,
        testonly = common_args.testonly,
    )
    original = '_%s' % name if vendor else name
    # Breaking change of rules_nondejs 2.0 for `linking`.
    # https://github.com/bazelbuild/rules_nodejs/releases?after=2.0.1
    templated_args = templated_args + ['--nobazel_run_linker']
    jasmine_node_test(
        name = original,
        deps = deps + [lib_name],
        tags = (tags + ['manual']) if vendor else tags,
        templated_args = templated_args,
        size = size,
        **kargs,
    )
    inspect_original = '%s.inspect' % original
    jasmine_node_test(
        name = inspect_original,
        deps = deps + [lib_name],
        tags = tags + ['manual'],
        templated_args = templated_args + ['--node_options=--inspect-brk'],
        size = size,
        **kargs,
    )
    if vendor:
        kargs['bin'] = original
        binary_wrapper_test(
            name = name,
            tags = tags,
            size = size,
            **kargs,
        )
        kargs['bin'] = inspect_original
        binary_wrapper_test(
            name = '%s.inspect' % name,
            tags = tags,
            size = size,
            **kargs,
        )
