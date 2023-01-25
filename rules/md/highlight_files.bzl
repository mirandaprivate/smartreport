'''Convert arbitrary source files into syntax-highlighted html files.

TODO (zhongming): This rule work fine.  But it does not represent the best
coding practicies.
'''

load(
    '@bazel_skylib//lib:paths.bzl',
    'paths',
)

# TODO (zhongming): Expand this list as needed.  I want to be extra conservative
# about what this rule supports.
_SUPPORTED_LANGS = [
    '.css',
    '.js',
    '.md',
    '.ts',
]


def _highlight_files(ctx):
    args = ctx.actions.args()
    args.use_param_file(param_file_arg = '--param-file=%s')
    args.add(ctx.bin_dir.path)

    direct_files = []
    for src in ctx.files.srcs:
        ext = src.extension
        relpath = paths.relativize(src.short_path, ctx.label.package)
        # foo.ts => foo_ts.html
        output_path = '%s_%s.html' % (relpath[:-(len(ext) + 1)], ext)
        output_file = ctx.actions.declare_file(output_path)
        direct_files.append(output_file)

        args.add(src.path)

    ctx.actions.run(
        inputs = ctx.files.srcs,
        executable = ctx.executable._highlight,
        outputs = direct_files,
        arguments = [args],
        progress_message = 'HighlightFiles',
    )

    return DefaultInfo(files = depset(direct_files))


highlight_files = rule(
    implementation = _highlight_files,
    attrs = {
        'srcs': attr.label_list(
            allow_files = True,
            providers = _SUPPORTED_LANGS,
        ),
        '_highlight': attr.label(
            default = Label('//rules/md/tools:highlight'),
            executable = True,
            cfg = 'target',
        ),
    },
)
