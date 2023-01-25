'''
Convenience rule for running .ts binaries.
'''

load(
    ':ts_library.bzl',
    'ts_library',
)
load(
    ':nodejs_binary.bzl',
    'nodejs_binary',
)
load(
    ':function.bzl',
    'function',
)

def ts_binary(
        name,
        main,
        deps = [],
        data = [],
        **kargs,
    ):
    '''Create an executable binary from .ts files.

    Docs:
    https://bazelbuild.github.io/rules_nodejs/Built-ins.html#nodejs_binary

    Args:
        name: Target name.
        main: The entry point .ts source file.  Could be a file or a label.  If
            it is a file, it must be a .ts file.  When the .ts file (is a file)
            is located in the same directory as this target, the `entry_point`
            may be omitted.  Otherwise, an error will occur.
        deps: ts dependencies such as ts_library() targets.
    '''
    common_args = function.get_common_args(**kargs)
    lib_name = '_%s.lib' % name
    ts_library(
        name = lib_name,
        srcs = [main],
        deps = deps,
        tags = common_args.tags,
        testonly = common_args.testonly,
    )
    nodejs_binary(
        name = name,
        data = deps + data + [lib_name] ,
        entry_point = main,
        **kargs,
    )
