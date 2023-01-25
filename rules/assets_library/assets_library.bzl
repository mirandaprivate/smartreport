'''Generate assets ts file.
'''

load(
    '@io_bazel_rules_sass//sass:sass.bzl',
    'sass_library',
)
load(
    '//rules:ts.bzl',
    'ts_library',
)
load(
    '//rules:label.bzl',
    get_module_name = 'module_name',
)


def _gen_assets_file_impl(ctx):
    paths = []
    srcs = ctx.files.srcs
    for file in srcs:
        paths.append(file.path)

    ts = ctx.outputs.output_ts
    scss = ctx.outputs.output_scss
    args = ctx.actions.args()
    args.add_all('--srcs', paths)
    args.add('--output-ts', ts)
    args.add('--output-scss', scss)
    args.add('--workspace', ctx.workspace_name)

    ctx.actions.run(
        outputs = [ts, scss],
        inputs = srcs,
        executable = ctx.executable._generator,
        arguments = [args],
        mnemonic = 'GenAssetsFile',
    )
    return [
        DefaultInfo(
            files = depset([ts, scss]),
        ),
    ]

gen_assets_file = rule(
    implementation = _gen_assets_file_impl,
    attrs = {
        'srcs': attr.label_list(
            allow_files = True,
            doc = 'Source files.',
        ),
        'output_ts': attr.output(
            doc = 'The output ts file name.',
        ),
        'output_scss': attr.output(
            doc = 'The output scss file name.',
        ),
        '_generator': attr.label(
            default = Label('//rules/assets_library:generator'),
            executable = True,
            cfg = 'target',
        )
    },
)


def assets_library(
        name,
        srcs,
        visibility=None,
        testonly=False,
        tags=[],
        module_name=None,
):
    '''Rule to generate a ts & scss file that contains a enum/map of input srcs.

    Args:
        name: target name.
        srcs: srcs,
        visibility: None,
        testonly: False,
        tags: [],
        module_name: None,

    Example:
        srcs = ['path/to/foo.png', 'bar_a.otf']
        workspace_name = 'logi'

        The output ts will be:
        ```ts
        export enum Assets {
            FOO_PNG = "logi/path/to/foo.png",
            BAR_A_OTF = "logi/bar_a.otf",
        }
        The output scss will be:
        ```scss
        $logi-assets: (
            foo_png = "logi/path/to/foo.png",
            bar_a_otf = "logi/bar_a.otf",
        )
        ```
    '''
    output_ts = '%s.ts' % name
    output_scss = '%s.scss' % name
    gen_assets_file(
        name = '_gen_%s_ts' % name,
        srcs = srcs,
        output_ts = output_ts,
        output_scss = output_scss,
    )

    ts_library(
        name = '%s_ts' % name,
        srcs = [output_ts],
        data = srcs,
        visibility = visibility,
        testonly = testonly,
        tags = tags,
        module_name = module_name,
    )

    sass_library(
        name = '%s_scss' % name,
        srcs = [output_scss],
        visibility = visibility,
        testonly = testonly,
        tags = tags,
    )
