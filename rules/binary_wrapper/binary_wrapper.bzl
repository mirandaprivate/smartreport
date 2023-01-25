'''Wrapper a binary executable file.

Provides extra env vars such as `RUNFILES_DIR` to make the bianry more
powerful. It is very usedful for the system program languages such as nodejs,
golang, rust, python and so on. It make the the binary can stripped from the
`bazel run` possible.
'''

load(
    '//rules:function.bzl',
    'function',
)
load(
    ':binary_info.bzl',
    'BinaryInfo',
)

_SCRIPT_TMPL = '''\
#!/bin/bash -e

#Workspace name.
WORKSPACE={workspace}

# The binary short path.
BIN={bin}

BIN_PATH=$PWD/$BIN

# If env does not has env `BUILD_WORKSPACE_DIRECTORY` and
# `BUILD_WORKING_DIRECTORY`, it means that the bash is not running via
# `bazel run`. Get more info from
# https://docs.bazel.build/versions/2.0.0/user-manual.html#run
if [ -z $BUILD_WORKSPACE_DIRECTORY ] || [ -z $BUILD_WORKING_DIRECTORY ]
then

    if [ -z $RUNFILES_DIR ]
    then

        # If the env `RUNFILES_DIR` is not set and `$0.runfiles` is a
        # directory, it means the the bash is running by bazel action
        # (ctx.actions.run). And the actual bin path is under the
        # `$0.runfiles`.
        if [ -d $0.runfiles ]
        then
            export RUNFILES_DIR=$0.runfiles
            BIN_PATH=$0.runfiles/$WORKSPACE/$BIN
        fi
    else

        # If the env `RUNFILES_DIR` is set, we need set the bin path under the
        # runfiles.
        BIN_PATH=$RUNFILES_DIR/$WORKSPACE/$BIN
    fi

# When the bash is running via `bazel run`. The pwd would set as the binary
# runfiles tree, so the `RUNFIES_DIR` is the parent dir of current pwd.
else
    export RUNFILES_DIR=$(dirname $PWD)
fi

# Run the binary. Must use "$0" not $0, otherwise the empty string arg '' would
# missing.
$BIN_PATH "$@"
'''

BinaryWrapperInfo = provider(
    fields = {
        'wrapper': 'The wrapper binary file.',
        'files': 'The files depset of the wrapped binary',
        'info': 'The original binary `BinaryInfo`.',
    }
)


def binary_wrapper_impl(ctx):
    bin = ctx.executable.bin
    file_depsets = [
        ctx.attr.bin.files,
        ctx.attr.bin.default_runfiles.files,
    ]
    files = depset(transitive = file_depsets)

    script = ctx.outputs.script
    ctx.actions.write(
        output = script,
        content = _SCRIPT_TMPL.format(
            bin = bin.short_path,
            workspace = ctx.workspace_name,
        ),
        is_executable = True,
    )

    binary_info = BinaryInfo(
        bin = bin,
        files = files,
        target = ctx.attr.bin,
    )

    return [
        DefaultInfo(
            executable = script,
            runfiles = ctx.runfiles(
                transitive_files = files,
            ),
        ),
        BinaryWrapperInfo(
            wrapper = script,
            files = files,
            info = binary_info,
        ),
    ]

binary_wrapper_attr = {
    'bin': attr.label(
        mandatory = True,
        executable = True,
        cfg = 'target',
        doc = 'The binary target.',
    ),
}

binary_wrapper_out = {
    'script': '%{name}.sh',
}

_binary_wrapper = rule(
    executable=True,
    implementation = binary_wrapper_impl,
    attrs = binary_wrapper_attr,
    outputs = binary_wrapper_out,
    provides = [BinaryWrapperInfo],
)

def binary_wrapper(name, **kargs):
    common_args = function.get_common_args(**kargs)
    _binary_wrapper(
        name = name,
        bin = kargs['bin'],
        tags = common_args.tags,
        testonly = common_args.testonly,
        visibility = common_args.visibility,
    )
