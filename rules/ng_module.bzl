'''
Custom ng_module rule
'''

load(
    '@npm//@bazel/typescript:index.bzl',
    'ts_library',
)
load(
    '@io_bazel_rules_sass//:defs.bzl',
    'sass_binary',
)
load(
    ':label.bzl',
    _module_name = 'module_name',
)

def ng_module(
        name,
        srcs,
        assets = [],
        tsconfig = None,
        module_name = None,
        output_target = None,
        output_module = None,
        **kargs,
    ):
    '''A wrapper for Angular `ng_module`.

    Docs:
    https://github.com/angular/angular/blob/9.1.11/packages/bazel/src/ng_module.bzl#L688

    Difference from the vanilla `ng_module` rule:
        1.  The attribute `assets` is removed.
        2.  The attribute `srcs` accept .html .pug .css .less .sass .scss.

    Usage example:
        _ng_module(
            name = 'arrow',
            srcs = [
                'component.ts',
                'data.ts',
                'index.ts',
                'module.ts',
                'style.sass',
                'template.pug',
            ],
            deps = [
                '@angular//packages/core',
            ],
            visibility = [label('../:__pkg__')],
        )
    '''
    module_name = module_name or _module_name()
    ts_library(
        name = name,
        compiler = Label('//rules:tsc_wrapped_with_angular'),
        module_name = module_name,
        package_name = module_name,
        use_angular_plugin = True,
        supports_workers = True,
        srcs = [s for s in srcs if _is_asset(s) == False],
        angular_assets = assets + _assets([s for s in srcs if _is_asset(s)]),
        tsconfig = tsconfig,
        prodmode_target = output_target,
        devmode_target = output_target,
        devmode_module = output_module,
        prodmode_module = output_module,
        **kargs,
    )


def _is_asset(filepath):
    return filepath.split('.')[-1] in ['html', 'pug', 'css', 'less', 'sass', 'scss']


def _assets(srcs):
    return [_asset(src) for src in srcs]


def _asset(src):
    '''Rule for transforming .pug .less .sass .scss, return file path as string.
    '''
    ext = src.split('.')[-1]
    if ext not in ['scss', 'sass']:
        return src
    if ext == 'sass' or ext == 'scss':
        name = src.replace('/', '_').replace('.sass', '').replace('.scss', '')
        output = src.replace('.sass', '.css').replace('.scss', '.css')
        _css(
            name = name,
            src = src,
            output = output,
        )
        return output


def _css(
        name,
        src,
        output
    ):
    sass_binary(
        name = '_%s_css' % name,
        src = src,
        output_dir = '/'.join(output.split('/')[:-1]),
        output_name = output.split('/')[-1],
    )
