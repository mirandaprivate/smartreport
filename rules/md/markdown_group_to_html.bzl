'''Generate html files from markdown file group.
'''

load(
    ':markdown_group.bzl',
    'MarkdownGroupInfo',
)


def _markdown_group_to_html(ctx):
    args = ctx.actions.args()

    src = ctx.attr.srcs[0]
    group = src[MarkdownGroupInfo]

    outputs = []
    for file in group.md_files:
        output_path = file.short_path[:-len('.md')] + '.html'
        output_file = ctx.actions.declare_file(output_path)
        outputs.append(output_file)
        md_file_info = '%s:%s' % (output_file.path, file.path)
        args.add(md_file_info)

    for image_data in group.data:
        output_file = ctx.actions.declare_file(image_data.short_path)
        outputs.append(output_file)
        image_data_info = '%s:%s' % (output_file.path, image_data.path)
        args.add(image_data_info)

    ctx.actions.run(
        inputs = ctx.files.srcs,
        executable = ctx.executable._md_to_html,
        outputs = outputs,
        arguments = [args],
        progress_message = 'MarkdownGroupToHtml',
    )

    return DefaultInfo(files = depset(outputs))

markdown_group_to_html = rule(
    implementation = _markdown_group_to_html,
    attrs = {
        'srcs': attr.label_list(
            providers = [MarkdownGroupInfo],
            doc = 'The list of markdown document groups to convert to html.',
        ),
        '_md_to_html': attr.label(
            default = Label('//rules/md/tools:to_html'),
            executable = True,
            cfg = 'target',
        ),
    },
)
