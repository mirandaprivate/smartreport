'''Return then `BinaryInfo` of a binary target.
'''


BinaryInfo = provider(
    fields = {
        'bin': 'The exectutable bianry file.',
        'files': 'The filea deps depset of the binary',
        'target': 'The binary bazel target itself',
    }
)


def _binary_info_impl(ctx):
    bin = ctx.executable.bin
    file_depsets = [
        ctx.attr.bin.files,
        ctx.attr.bin.default_runfiles.files,
    ]
    files = depset(transitive = file_depsets)

    return [
        BinaryInfo(
            bin = bin,
            files = files,
            target = ctx.attr.bin,
        ),
    ]

_binary_info_attr = {
    'bin': attr.label(
        mandatory = True,
        executable = True,
        cfg = 'target',
        doc = 'The binary target.',
    ),
}

binary_info = rule(
    implementation = _binary_info_impl,
    attrs = _binary_info_attr,
    provides = [BinaryInfo],
)
