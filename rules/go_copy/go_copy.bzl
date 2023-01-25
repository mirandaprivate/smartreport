'''`go_copy` rule generate repo infomation.
'''

load(
    '@logi_build_defs//:constants.bzl',
    'REPO_DIR'
)
load(
    '@logi_build_vars//:envs.bzl',
    'NO_BAZEL_CACHE'
)
_DRIVER = Label('//rules/internal/go/go_copy:driver')

def _go_copy_impl(ctx):
    out = ctx.actions.declare_file('%s.copied.txt' % ctx.label.name)
    args = ctx.actions.args()
    target_files = []
    file_type = 'normal'
    # Go files from the rule `go_assetfs`
    target_files.extend(ctx.files.target)
    # Go file from rule go_proto_library.
    if OutputGroupInfo in ctx.attr.target:
        info = ctx.attr.target[OutputGroupInfo]
        if 'go_generated_srcs' in info:
            target_files.extend(info['go_generated_srcs'].to_list())
            file_type = 'proto'
    args.add_all(['--repo', REPO_DIR])
    args.add_all('--inputs', target_files)
    args.add_all('--output', [out])
    args.add_all('--workspace', [ctx.workspace_name])
    args.add_all('--type', [file_type])
    ctx.actions.run(
        outputs = [out],
        inputs = target_files,
        executable = ctx.executable._driver,
        arguments = [args],
        mnemonic = 'CopyGoFiles',
        # Use the following statement to force disable bazel cache, T3170. When
        # we build some proto library, it will generate *_proto.go file, then
        # remove this file and build the proto library again, the file will no
        # longer generated because of bazel cache, so we update the content of
        # env variable `$NO_BAZEL_CACHE`, it will no longer use bazel cache.
        env = { 'NO_BAZEL_CACHE': str(NO_BAZEL_CACHE) },
        execution_requirements = {
            'no-sandbox': '',
        },
    )
    return [
        DefaultInfo(
            files = depset([out]),
        ),
    ]

_go_copy_attrs = {
    'target': attr.label(
        mandatory = True,
        doc = 'The input target which would generated a go file.',
    ),
    '_driver': attr.label(
        default = _DRIVER,
        executable = True,
        cfg = 'target',
    ),
}

go_copy = rule(
    attrs = _go_copy_attrs,
    implementation = _go_copy_impl,
)
