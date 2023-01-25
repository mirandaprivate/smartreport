'''Generate angular icon group ts file.
'''

load(
    '@bazel_skylib//lib:structs.bzl',
    'structs',
)


NgIconGroupInfo = provider(
    fields = {
        'icon_info_list': '''The icon info list.

            For example,
                [
                    {
                        id = 'foo',
                        path = 'tools/a.svg',
                        groups = ['group1', 'group2'],
                    },
                    {
                        id = 'bar',
                        path = 'tools/b.svg',
                        groups = ['group1'],
                    },
                ]
            ''',
        'files': 'The icon files group.',
    }
)

def _run_ts_generator(
        *,
        action_factory,
        generator,
        output,
        config,
        files,
    ):
    args = action_factory.args()
    args.add('--config', config)
    args.add('--output', output)
    action_factory.run(
        executable = generator,
        outputs = [output],
        inputs = depset([config], transitive = [files]),
        arguments = [args],
        mnemonic = 'GenerateNgIconTs',
    )

def _get_icon_id(*, path, strip_prefix):
    # Strip the external repository name before get id, for example the path is
    #   external/com_logiocean_design_fontdb/icons/common/ic_window_restore.svg,
    # the prefix 'external/com_logiocean_design_fontdb' should be ignore.
    if path.startswith('external'):
        path = '/'.join(path.split('/')[2:])
    if not path.startswith(strip_prefix):
        fail('The icon %s is not startswith strip_prefix %s.' %
            (path, strip_prefix))
    id = path[len(strip_prefix):]
    id = id[id.startswith('/') and len('/'):]
    if not '.' in id:
        return id
    return '.'.join(id.split('.')[:-1]).replace('/', '_')

def _ng_icon_group_impl(ctx):
    icon_info_list = []
    exist_ids = []
    extend_file_depsets = []
    for extend in ctx.attr.extends:
        extend_file_depsets.append(extend[NgIconGroupInfo].files)
        for icon in extend[NgIconGroupInfo].icon_info_list:
            icon_dict = structs.to_dict(icon)
            new_group = [ctx.attr.name]
            new_group.extend(icon.group)
            icon_dict['group'] = depset(new_group).to_list()
            icon_info_list.append(struct(**icon_dict))
            exist_ids.append(icon.id)
            for group in icon.group:
                if group == ctx.attr.name:
                    fail('The group name %s is already exist.', ctx.attr.name)
    for icon in ctx.files.srcs:
        id = _get_icon_id(path=icon.path, strip_prefix=ctx.attr.strip_prefix)
        if id in exist_ids:
            fail('The id %s is dumplicated.', id)
        if id in [info.id for info in icon_info_list]:
            continue
        icon_info_list.append(struct(
            id = id,
            path = icon.path,
            group = [ctx.attr.name],
        ))

    config = struct(
        icon_info_list = icon_info_list
    )
    config_file = ctx.actions.declare_file('%s.json' % ctx.label.name)
    ctx.actions.write(
        output = config_file,
        content = config.to_json(),
    )
    files = depset(ctx.files.srcs, transitive = extend_file_depsets)
    compiled_ts = ctx.outputs.compiled_ts
    if compiled_ts:
        _run_ts_generator(
            action_factory = ctx.actions,
            generator = ctx.executable._generator,
            output = compiled_ts,
            config = config_file,
            files = files,
        )
    return [
        DefaultInfo(
            files = files,
        ),
        NgIconGroupInfo(
            icon_info_list = icon_info_list,
            files = files,
        ),
    ]

ng_icon_group = rule(
    implementation = _ng_icon_group_impl,
    attrs = {
        'srcs': attr.label_list(
            allow_files = True,
            doc = 'The files to the icons.',
        ),
        'strip_prefix': attr.string(
            doc = '''The prefix to strip from srcs svg files.

                The result is the id of svg, The default value is '' and also,
                the prefix '/' and suffix will be removed.
                    For example
                        src             strip_prefix      id
                    tools/ng/foo.svg    tools/ng          foo
                    tools/ng/foo.svg    tools/ng/         foo
                    tools/foo.test.svg  tools             foo.test
                ''',
        ),
        'extends': attr.label_list(
            doc = '''The extend to this icon group.

                For example
                    group foo: [a.svg, b.svg]
                    group bar: [c.svg]
                    group kar extends foo: [d.svg]

                    result:     file    group
                                a.svg   [foo, kar]
                                b.svg   [foo, kar]
                                c.svg   [bar]
                                d.svg   [kar]
                ''',
            providers =[NgIconGroupInfo],
        ),
        'compiled_ts': attr.output(
            doc = 'The output ts file name.'
        ),
        '_generator': attr.label(
            default = Label('//rules/ng_icon_group:generator'),
            executable = True,
            cfg = 'target',
        )
    },
)
