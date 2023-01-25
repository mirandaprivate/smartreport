'''
Macro rule ts_proto_library.
'''
load(
    '//rules:ts_library.bzl',
    'ts_library',
)
load(
    '//rules:label.bzl',
    get_module_name = 'module_name',
)
load(
    ':ts_proto_compile.bzl',
    'ts_proto_compile',
)


_COMMON_DEPS = [
    '//base/ts/common/builder',
    '//base/ts/common/exception',
    '//base/ts/common/mapped_types',
    '//base/ts/common/validator',
    '//base/ts/grpc/node',
    '//base/ts/grpc/web',
    '//base/ts/proto',
    '@npm//class-validator',
    '@npm//@types/long',
    '@npm//long',
    '@npm//rxjs',
]

def ts_proto_library(
        name,
        proto,
        module_name = None,
        deps = [],
        testonly = False,
        visibility = None,
        tags = [],
    ):
    # Compile protos
    compile_name = name + '_compile_'
    ts_proto_compile(
        name = compile_name,
        proto = proto,
        module = module_name or get_module_name('logi-pb'),
        visibility = visibility,
        deps_compile = ['%s_compile_' % dep for dep in deps],
    )

    # Create ts library
    ts_library(
        name = name,
        srcs = [compile_name],
        module_name = module_name or get_module_name('logi-pb'),
        deps = deps + _COMMON_DEPS,
        testonly = testonly,
        visibility = visibility,
        tags = tags,
    )
