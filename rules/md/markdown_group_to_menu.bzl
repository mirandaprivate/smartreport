'''Generate html files from markdown file group.
'''
load(
    ':markdown_group.bzl',
    'MarkdownGroupInfo',
)


def _markdown_group_to_menu(ctx):
    src = ctx.attr.srcs[0]
    group = src[MarkdownGroupInfo]
    content = str({
        'prefix': ctx.workspace_name + '/' + ctx.label.package,
        'menu': group.tree})
    out = ctx.actions.declare_file(ctx.label.name + '.json')
    args = ctx.actions.args()
    args.add_all([
        '--output', out,
        '--content', content,
    ])
    ctx.actions.run(
        executable = ctx.executable._driver,
        outputs = [out],
        arguments = [args],
        mnemonic = 'GenerateMdJson',
    )
    return [DefaultInfo(files = depset([out]))]

markdown_group_to_menu = rule(
    implementation = _markdown_group_to_menu,
    attrs = {
        'srcs': attr.label_list(
            providers = [MarkdownGroupInfo],
            doc = 'The list of markdown_group() targets to convert to html.',
        ),
        '_driver': attr.label(
            default = Label('//rules/md/tools:to_json'),
            executable = True,
            cfg = 'target',
            doc = 'Save json file.',
        ),
    },
)
