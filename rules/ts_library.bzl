load(
    '@npm//@bazel/typescript:index.bzl',
    _ts_library = 'ts_library',
)
# load(
#     '//rules/internal/utils:internal.bzl',
#     'internal_ts_config',
# )

def ts_library(
        module_name = '',
        output_target = None,
        output_module = None,
        **kargs,
    ):
    '''Wrapped ts_library,

    Docs:
    https://github.com/bazelbuild/rules_nodejs/blob/stable/packages/typescript/internal/build_defs.bzl#L318
    '''
    _ts_library(
        # tsconfig = tsconfig or internal_ts_config(),
        module_name = module_name,
        package_name = module_name,
        prodmode_target = output_target,
        devmode_target = output_target,
        devmode_module = output_module,
        prodmode_module = output_module,
        **kargs,
    )
