'''Custom go_library wrapper that simplies importpath.
'''

load(
    '@io_bazel_rules_go//go:def.bzl',
    _go_library = 'go_library',
    _go_binary = 'go_binary',
    _go_test = 'go_test',
)

'''Various go proto libraries.
'''
load(
    '@io_bazel_rules_go//proto:def.bzl',
    _go_proto_library = 'go_proto_library',
)
# load(
#     '//rules/go_copy:go_copy.bzl',
#     'go_copy',
# )
load(
    ':label.bzl',
    'go_module_name',
)
load(
    '//rules/binary_wrapper:binary_wrapper.bzl',
    'binary_wrapper',
)



def go_test(**kargs):
    _go_test(**kargs)

def go_binary(
        name,
        vendor = False,
        **kargs,
    ):
    ''' Wrappered go binary.

    Docs:
    https://github.com/bazelbuild/rules_go/blob/master/go/core.rst#go_binary

    Args:
        vendor: wrappeer the rule, not use the original rule, if use binary
            wrapper, it can make the bianry run stripped from bazel.
    '''
    original = '_%s' % name if vendor else name
    _go_binary(
        name = original,
        **kargs,
    )
    if vendor:
        kargs['bin'] = original
        binary_wrapper(
            name = name,
            **kargs,
        )


def go_library(
    name,
    importpath = '',
    **kargs,
):
    '''Custom wrapper for the official go_library rule.

    Docs:
    https://github.com/bazelbuild/rules_go/blob/master/go/core.rst#go_library
    '''
    if not importpath:
        importpath = go_module_name(name) if name != 'go_default_library' \
            else go_module_name()
    _go_library(
        name = name,
        importpath = importpath,
        **kargs,
    )



def go_proto_library(
        name,
        importpath = '',
        deps = [],
        **kargs,
    ):
    '''Compile go_library for protos.

    Docs:
    https://github.com/bazelbuild/rules_go/blob/master/proto/core.rst#go_proto_library
    '''
    if not importpath:
        importpath = go_module_name()
    _go_proto_library(
        name = name,
        deps = deps + [
            # '@org_golang_google_protobuf//reflect/protoreflect',
            # '@org_golang_google_protobuf//runtime/protoiface',
            # '@org_golang_google_protobuf//runtime/protoimpl',
            # '@org_golang_google_protobuf//types/known/anypb',
            # '@com_github_golang_protobuf//ptypes',
            # '@org_golang_google_protobuf//types/descriptorpb',
            '@com_github_envoyproxy_protoc_gen_validate//validate:go_default_library',
            "@go_googleapis//google/api:annotations_go_proto",
        ],
        # compilers = [
        #     Label('//rules:go_proto_validate'),
        #     Label('//rules:go_grpc'),
        # ],
        compilers = [
            "@com_github_grpc_ecosystem_grpc_gateway_v2//:go_apiv2",
            "@com_github_grpc_ecosystem_grpc_gateway_v2//:go_grpc",
            "@com_github_grpc_ecosystem_grpc_gateway_v2//protoc-gen-grpc-gateway:go_gen_grpc_gateway",
        ],
        importpath = importpath,
        **kargs,
    )
    # go_copy(
    #     name = '_%s_copy' % name,
    #     target = name,
    # )


def grpc_gateway_library(
        name,
        deps = [],
        importpath = '',
        **kargs,
    ):
    '''Use proto and compile gateway and grpc code.

    Docs:
    https://github.com/bazelbuild/rules_go/blob/master/proto/core.rst#go_proto_library
    '''
    if not importpath:
        importpath = go_module_name()
    _go_proto_library(
        name = name,
        deps = deps + [
            '@io_bazel_rules_go//proto/wkt:descriptor_go_proto',
            '@go_googleapis//google/api:annotations_go_proto',
        ],
        compilers = [
            '@io_bazel_rules_go//proto:go_grpc',
            "@com_github_grpc_ecosystem_grpc_gateway_v2//protoc-gen-grpc-gateway:go_gen_grpc_gateway",
        ],
        importpath = importpath,
        **kargs,
    )
    # go_copy(
    #     name = '_%s_copy' % name,
    #     target = name,
    # )
