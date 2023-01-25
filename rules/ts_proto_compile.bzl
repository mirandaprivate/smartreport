'''
Include ts_proto_compile rule.

It uses protoc to compile proto and ts_plugin to generate ts code.
This rule is according to `third_party/bazel/proto_grpc/aspect.bzl`.
'''

load(
    '@rules_proto_grpc//:defs.bzl',
    'ProtoPluginInfo',
)
load(
    '@rules_proto//proto:defs.bzl',
    'ProtoInfo',
)
load(
    '@rules_proto_grpc//internal:common.bzl',
    'copy_file',
    'descriptor_proto_path',
    'get_output_filename',
)

ModuleNameInfo = provider(
    fields = {
        'ts_proto_to_module_name': 'Mapping of the proto to module_name in ts.',
    }
)

ts_proto_compile_attrs = {
    'prefix_path': attr.string(
        doc = 'Path to prefix to the generated files in the output directory.',
    ),
    'proto': attr.label(
        mandatory = True,
        doc = 'The target proto file to generate ts code.',
    ),
    'module': attr.string(
        mandatory = True,
        doc = 'Module_name of the corresponding ts_proto_library.',
    ),
    'deps_compile': attr.label_list(
        default = [],
        doc = 'The deps ts_proto_complie of corresponding ts_proto_library',
    ),
}


def _ts_proto_compile_impl(ctx):
    ###
    ### Part 1: setup variables used in scope
    ###

    # <struct> The resolved protoc toolchain
    protoc_toolchain_info = ctx.toolchains[
        str(Label('@rules_proto_grpc//protobuf:toolchain_type'))
    ]

    # <Target> The resolved protoc compiler from the protoc toolchain
    protoc = protoc_toolchain_info.protoc_executable

    # <ProtoInfo> The ProtoInfo of the current node
    proto_info = ctx.attr.proto[ProtoInfo]

    # <string> The directory where the outputs will be generated, relative to
    # the package.
    rel_outdir = '.'
    if ctx.attr.prefix_path:
        rel_outdir += '/' + ctx.attr.prefix_path

    # <string> The full path to the directory where the outputs will be
    # generated.
    full_outdir = ctx.bin_dir.path + '/'
    if ctx.label.workspace_root:
        full_outdir += ctx.label.workspace_root + '/'
    if ctx.label.package:
        full_outdir += ctx.label.package + '/'
    full_outdir += rel_outdir

    # <list<PluginInfo>> A list of PluginInfo providers for the requested
    # plugins
    plugins = [plugin[ProtoPluginInfo] for plugin in ctx.attr._plugins]

    # <list<File>> The list of generated artifacts like 'foo_pb2.py' that we
    # expect to be produced.
    output_files = []

    # <list<File>> The list of generated artifacts directories that we
    # expect to be produced.
    output_dirs = []


    ###
    ### Part 2: iterate over plugins
    ###

    # Each plugin is isolated to its own execution of protoc, as plugins may
    # have differing exclusions that cannot be expressed in a single protoc
    # execution for all plugins

    for plugin in plugins:

        ###
        ### Part 2.1: fetch plugin tool and runfiles
        ###

        # <list<File>> Files required for running the plugins
        plugin_runfiles = []

        # <list<opaque>> Plugin input manifests
        plugin_input_manifests = None

        # Get plugin name
        plugin_name = plugin.name
        if plugin.protoc_plugin_name:
            plugin_name = plugin.protoc_plugin_name

        # Add plugin executable if not a built-in plugin
        plugin_tool = None
        if plugin.tool_executable:
            plugin_tool = plugin.tool_executable

        # Add plugin runfiles if plugin has a tool
        if plugin.tool:
            plugin_runfiles, plugin_input_manifests = ctx.resolve_tools(
                tools = [plugin.tool],
            )
            plugin_runfiles = plugin_runfiles.to_list()
        if not plugin_input_manifests:
            plugin_input_manifests = []

        # Add extra plugin data files
        plugin_runfiles += plugin.data

        # Check plugin outputs
        if plugin.output_directory and (plugin.out or plugin.outputs):
            fail('Proto plugin {} cannot use output_directory in conjunction ' +
                'with outputs or out'.format(plugin.name))


        ###
        ### Part 2.2: gather proto files and filter by exclusions
        ###

        # <list<File>> The filtered set of .proto files to compile
        protos = []

        for proto in proto_info.direct_sources:
            # Check for exclusion
            if any([
                proto.dirname.endswith(exclusion) or
                proto.path.endswith(exclusion)
                for exclusion in plugin.exclusions
            ]) or proto in protos:
                continue

            # Proto not excluded
            protos.append(proto)

        # Skip plugin if all proto files have now been excluded
        if len(protos) == 0:
            continue


        ###
        ### Part 2.3: declare per-proto generated outputs from plugin
        ###

        # <list<File>> The list of generated artifacts like 'foo_pb2.py' that we
        # expect to be produced by this plugin only
        plugin_outputs = []

        for proto in protos:
            for pattern in plugin.outputs:
                plugin_outputs.append(ctx.actions.declare_file('{}/{}'.format(
                    rel_outdir,
                    get_output_filename(proto, pattern, proto_info)
                )))

        # Append current plugin outputs to global outputs before looking at
        # per-plugin outputs; these are manually added globally as there may
        # be srcjar outputs.
        output_files.extend(plugin_outputs)


        ###
        ### Part 2.4: declare per-plugin artifacts
        ###

        # Some protoc plugins generate a set of output files (like python) while
        # others generate a single 'archive' file that contains the individual
        # outputs (like java). Jar outputs are gathered as a special case as we
        # need to post-process them to have a 'srcjar' extension (java_library
        # rules don't accept source jars with a 'jar' extension)

        out_file = None
        if plugin.out:
            # Define out file
            out_file = ctx.actions.declare_file('{}/{}'.format(
                rel_outdir,
                plugin.out.replace('{name}', ctx.label.name)
            ))
            plugin_outputs.append(out_file)

            if not out_file.path.endswith('.jar'):
                # Add output direct to global outputs
                output_files.append(out_file)
            else:
                # Create .srcjar from .jar for global outputs
                output_files.append(copy_file(
                    ctx, out_file,
                    '{}.srcjar'.format(out_file.basename.rpartition('.')[0]),
                    sibling=out_file
                ))


        ###
        ### Part 2.5: declare plugin output directory
        ###

        # Some plugins outputs a structure that cannot be predicted from the
        # input file paths alone. For these plugins, we simply declare the
        # directory.

        if plugin.output_directory:
            out_file = ctx.actions.declare_directory(
                rel_outdir + '/' + '_plugin_' + plugin.name,
            )
            plugin_outputs.append(out_file)
            output_dirs.append(out_file)


        ###
        ### Part 2.6: build command
        ###

        # <Args> argument list for protoc execution
        args = ctx.actions.args()

        # Add descriptors
        pathsep = ctx.configuration.host_path_separator
        args.add('--descriptor_set_in={}'.format(pathsep.join(
            [f.path for f in proto_info.transitive_descriptor_sets.to_list()],
        )))

        # Add plugin if not built-in
        if plugin_tool:
            args.add('--plugin=protoc-gen-{}={}'.format(
                plugin_name,
                plugin_tool.path,
            ))

        # Add plugin out arg
        out_arg = out_file.path if out_file else full_outdir

        # Add options
        option_list = []

        # Add option module name options
        # Add deps module name.
        for dep in ctx.attr.deps_compile:
            for k, v in dep[ModuleNameInfo].ts_proto_to_module_name.items():
                option_list.append('{}={}'.format(k, v))
        # Add current module name.
        target_proto_path = proto_info.direct_sources[0].path
        root = proto_info.proto_source_root + '/'
        if target_proto_path.startswith(root):
            target_proto_path = target_proto_path[len(root):]
        option_list.append('{}={}'.format(target_proto_path, ctx.attr.module))

        # Add plugin options
        option_list += [
            option.replace('{name}', ctx.label.name)
            for option in plugin.options
        ]

        options = ','.join(option_list)

        if options != '':
            out_arg = '{}:{}'.format(options, out_arg)
        args.add('--{}_out={}'.format(plugin_name, out_arg))

        # Add source proto files as descriptor paths
        for proto in protos:
            args.add(descriptor_proto_path(proto, proto_info))

        ###
        ### Part 2.7: run command
        ###

        mnemonic = 'ProtoCompile'
        inputs = proto_info.transitive_descriptor_sets.to_list()
        # Proto files are not inputs, as they come via the descriptor sets
        inputs += plugin_runfiles
        tools = [protoc] + ([plugin_tool] if plugin_tool else [])
        progress_message = 'Compiling protoc outputs for {} plugin'.format(
            plugin.name,
        )
        # Run protoc
        ctx.actions.run(
            mnemonic = mnemonic,
            executable = protoc.path,
            arguments = [args],
            inputs = inputs,
            tools = tools,
            outputs = plugin_outputs,
            input_manifests = plugin_input_manifests,
            progress_message = progress_message,
        )


    ###
    ### Step 3: generate providers
    ###

    output_files_dict = {}
    if output_files:
        output_files_dict[full_outdir] = output_files

    return [
        DefaultInfo(
            files = depset(output_files),
            data_runfiles = ctx.runfiles(files=output_files),
        ),
        ModuleNameInfo(
            ts_proto_to_module_name = {target_proto_path: ctx.attr.module},
        ),
    ]

ts_proto_compile = rule(
    implementation = _ts_proto_compile_impl,
    attrs = dict(
        ts_proto_compile_attrs,
        _plugins = attr.label_list(
            doc = 'List of protoc plugins to apply',
            providers = [ProtoPluginInfo],
            default = [
                '//rules:ts_plugin',
            ],
        ),
    ),
    toolchains = ['@rules_proto_grpc//protobuf:toolchain_type'],
)
