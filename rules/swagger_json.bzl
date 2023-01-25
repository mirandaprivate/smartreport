# Rule to generate swagger spec file from grpc proto files.

load(
    '@rules_proto_grpc//grpc-gateway:defs.bzl',
    'gateway_openapiv2_compile',
)
load(
    ':copy.bzl',
    'copy_file',
)

# The `swagger mixin` binary will report conflicts of merging json files
# when same fields have same value, and return a non-zero exit code. The
# file is successfully gereated, but bazel takes it as failed. The only way to
# make it return zero exit code is to pip the result like following '|| true'.
_SWAGGER_TMPL = '''\
#!/bin/bash

{swagger} mixin {files} --output {output} -q || true
'''


def _merge_swagger_jsons_impl(ctx):
    jsons = ctx.files.jsons
    output = ctx.outputs.out
    if len(jsons) == 1:
        copy_file(
            ctx = ctx,
            src = jsons[0],
            dst = output,
        )
    else:
        swagger_script = ctx.actions.declare_file('%s.sh' % ctx.attr.name)
        json_path_list = [json.path for json in jsons]
        ctx.actions.write(
            output = swagger_script,
            content = _SWAGGER_TMPL.format(
                swagger = ctx.executable._go_swagger.path,
                files=' '.join(json_path_list),
                output=output.path,
            ),
            is_executable = True,
        )
        ctx.actions.run(
            inputs = depset(direct = jsons),
            outputs = [output],
            tools = [ctx.executable._go_swagger],
            executable = swagger_script,
        )
    return [
        DefaultInfo(
            files = depset(direct = [output]),
        ),
    ]


_merge_swagger_jsons = rule(
    implementation = _merge_swagger_jsons_impl,
    attrs = {
        'jsons': attr.label(
            mandatory = True,
            doc = 'Swagger json files generated by `gateway_swagger_compile`.',
        ),
        'out': attr.output(
            mandatory = True,
            doc ='The spec file to generate.'
        ),
        '_go_swagger': attr.label(
            default = '@com_github_go_swagger_go_swagger//cmd/swagger',
            executable = True,
            cfg = 'target',
        )
    }
)

def swagger_json(
        name,
        protos = [],
        out = None,
        testonly = False,
        visibility = None,
        tags = [],
    ):
    jsons = '_%s_swagger_json' % name
    gateway_openapiv2_compile(
        name = jsons,
        protos = protos,
    )
    out = out or '%s.json' % name
    _merge_swagger_jsons(
        name = name,
        jsons = jsons,
        out = out,
        testonly = testonly,
        visibility = visibility,
        tags = tags,
    )