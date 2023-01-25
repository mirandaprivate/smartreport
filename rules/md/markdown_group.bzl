'''Markdown document and its dependencies.
'''

load(
    ':markdown_document.bzl',
    'MarkdownDocumentInfo',
)

MarkdownGroupInfo = provider(
    'Markdown document group information',
    fields = {
        'title': 'Title of markdown document or group.',
        'deps': 'Source list of markdown document or group',
        'tree': 'Tree struct of document group.',
        'md_files': 'Markdown document files.',
        'data': 'Images and other data files used by markdown documents.',
    },
)

def _markdown_group_impl(ctx):
    group_array = []
    md_files = []
    data = []
    for dep in ctx.attr.deps:
        if MarkdownDocumentInfo in dep:
            document = dep[MarkdownDocumentInfo]
            path = document.md_files.to_list()[0].path
            # The bazel generated file path starts with the `bin_dir`.
            if path.startswith(ctx.bin_dir.path):
                path = path.replace(ctx.bin_dir.path + '/', '')
            group_array.append({
                'title': document.title,
                'url': path,
            })
            md_files.extend(document.md_files.to_list())
            data.extend(document.data.to_list())
        elif MarkdownGroupInfo in dep:
            group = dep[MarkdownGroupInfo]
            group_array.append(group.tree)
            md_files.extend(group.md_files)
            data.extend(group.data)
    tree = {
        'title': ctx.attr.title,
        'group': group_array,
    }
    files = data + md_files
    return [
        DefaultInfo(
            files = depset(files),
        ),
        MarkdownGroupInfo(
            deps = ctx.attr.deps,
            title = ctx.attr.title,
            tree = tree,
            md_files = md_files,
            data = data,
        ),
    ]

_markdown_group_attrs = {
    'title': attr.string(
        doc = 'Title of this document group.',
    ),
    'deps': attr.label_list(
        default = [],
        doc = 'A list of markdown_document of markdown_group.',
    ),
}

markdown_group = rule(
    implementation = _markdown_group_impl,
    attrs = _markdown_group_attrs,
)
