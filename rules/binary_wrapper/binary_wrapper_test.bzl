'''The binary test wrapper.

This rule should be named `binary_test_wrapper`, but in the bazel, a test
rule must be end with `_test`, so we named it `binary_wrapper_test. This rule
wrapped the test rule executable binary via the `RUNFILES_DIR` like the
`binary_wrapper`, then the test can run as exepected.
'''

load(
    '//rules:function.bzl',
    'function',
)

load(
    ':binary_wrapper.bzl',
    'binary_wrapper_attr',
    'binary_wrapper_impl',
    'binary_wrapper_out',
    'BinaryWrapperInfo',
)

_binary_wrapper_test = rule(
    test = True,
    attrs = binary_wrapper_attr,
    implementation = binary_wrapper_impl,
    outputs = binary_wrapper_out,
    provides = [BinaryWrapperInfo],
)

def binary_wrapper_test(name, **kargs):
    test_args = function.get_test_args(**kargs)
    _binary_wrapper_test(
        name = name,
        bin = kargs['bin'],
        tags = test_args.tags,
        testonly = test_args.testonly,
        visibility = test_args.visibility,
        size = test_args.size,
    )
