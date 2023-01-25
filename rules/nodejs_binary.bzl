'''Wrapped nodejs_binary rule.
'''

load(
    '@build_bazel_rules_nodejs//:index.bzl',
    _nodejs_binary = 'nodejs_binary',
)
load(
    '//rules/binary_wrapper:binary_wrapper.bzl',
    'binary_wrapper',
)

def nodejs_binary(
        name,
        vendor = False,
        templated_args = [],
        **kargs,
    ):
    '''Run a js binary.

    Docs:
    https://bazelbuild.github.io/rules_nodejs/Built-ins.html#nodejs_binary

    Args:
        vendor: Wrappeer the rule, not use the original rule, if use
            binary wrapper, it can make the bianry run stripped from bazel.
    '''
    original = '__%s' % name if vendor else name
    # Breaking change of rules_nondejs 2.0 for `linking`.
    # https://github.com/bazelbuild/rules_nodejs/releases?after=2.0.1
    new_args = ['--nobazel_run_linker']
    if vendor:
        # Not run node patches when binary is vendored. An error would occur
        # like below:
        # ```
        # Error: ENOENT: no such file or directory, open
        # '/home/chuji/.cache/bazel/_bazel_chuji/89fa56ba2ed35263d85ebf2f63a85d95/execroot/logi/bazel-out/host/bin/src/lib/version/VERSION
        # ```
        # https://github.com/bazelbuild/rules_nodejs/releases?after=2.0.1
        new_args.append('--nobazel_node_patches')
    new_args.extend(templated_args)
    _nodejs_binary(
        name = original,
        templated_args = new_args,
        **kargs,
    )
    inspect_original = '%s.inspect' % original
    _nodejs_binary(
        name = inspect_original,
        templated_args = new_args + ['--node_options=--inspect-brk'],
        **kargs,
    )
    if vendor:
        kargs['bin'] = original
        binary_wrapper(
            name = name,
            **kargs,
        )
        kargs['bin'] = inspect_original
        binary_wrapper(
            name = '%s.inspect' % name,
            **kargs,
        )
