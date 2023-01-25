'''Generate html files from markdown file group.
'''

load(
    ':markdown_document.bzl',
    'MarkdownDocumentInfo',
)



def _markdown_to_html(ctx):
    args = ctx.actions.args()

    direct_files = []
    for src in ctx.attr.srcs:
        document_src = src[MarkdownDocumentInfo]
        for md_file in document_src.md_files.to_list():
            # foo.md => foo.html
            md_output_path = md_file.short_path[:-len('.md')] + '.html'
            output_file = ctx.actions.declare_file(md_output_path)
            direct_files.append(output_file)
            md_file_info = '%s:%s' % (output_file.path, md_file.path)
            args.add(md_file_info)
        for image_data in document_src.data.to_list():
            _img_output_file = ctx.actions.declare_file(image_data.short_path)
            direct_files.append(_img_output_file)
            image_data_info = '%s:%s' % (_img_output_file.path, image_data.path)
            args.add(image_data_info)
    ctx.actions.run(
        inputs = ctx.files.srcs,
        executable = ctx.executable._md_to_html,
        outputs = direct_files,
        arguments = [args],
        progress_message = 'MarkdownToHtml',
    )

    return DefaultInfo(files = depset(direct_files))

markdown_to_html = rule(
    implementation = _markdown_to_html,
    attrs = {
        'srcs': attr.label_list(
            providers = [MarkdownDocumentInfo],
            doc = 'The list of markdown_document() targets to convert to html.',
        ),
        '_md_to_html': attr.label(
            default = Label('//rules/md/tools:to_html'),
            executable = True,
            cfg = 'target',
        ),
    },
)
