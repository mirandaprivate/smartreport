'''Markdown document and its dependencies.
'''

MarkdownDocumentInfo = provider(
    'Markdown document information',
    fields = {
        'title': 'Title of markdown document.',
        'deps': '''A list of labels of the markdown_document() targets that this
        document references.''',
        'md_files': 'A depset of .md files',
        'data': 'A list of image files',
    },
)

def _markdown_document_impl(ctx):
    transitive_md_files = []
    transitive_data_files = []
    deps = []
    for dep in ctx.attr.deps:
        info = dep[MarkdownDocumentInfo]
        deps.extend(info.deps)
        transitive_md_files.append(info.md_files)
        transitive_data_files.append(info.data)
    md_files = depset(
        direct = ctx.files.srcs,
        transitive = transitive_md_files,
    )
    for dat in ctx.attr.data:
        transitive_data_files.append(dat.files)
    data = depset(
        direct = ctx.files.data,
        transitive = transitive_data_files,
    )

    ctx.actions.write(
        output = ctx.outputs.manifest,
        content = '\n'.join([file.short_path for file in md_files.to_list()]) +
                  '\n'.join([dat.short_path for dat in data.to_list()]) + '\n',
    )
    return [
        DefaultInfo(
            files = depset(transitive = [depset(data.to_list()), md_files]),
        ),
        MarkdownDocumentInfo(
            data = data,
            deps = deps,
            md_files = md_files,
            title = ctx.attr.title,
        ),
    ]

_markdown_document_attrs = {
    'title': attr.string(
        doc = 'Title of a markdown document.',
    ),
    'srcs': attr.label_list(
        mandatory = True,
        allow_files = ['.md'],
        doc = '''A list of .md files.

        This is a list instead of a single file because .md files may contain
        cyclic references.

        When there is no cyclic dependencies, only one .md file should be put
        into this attribute to maximize granularity.
        ''',
    ),
    'deps': attr.label_list(
        default = [],
        providers = [MarkdownDocumentInfo],
        doc = '''Other markdown_document() targets that this document
        references.

        Note though, if there are cyclic references, all documents in the cycle
        should be lumped into a single markdown_document() target.
        ''',
    ),
    'data': attr.label_list(
        mandatory = False,
        allow_files = ['.png', '.jpg', '.jpeg', '.gif'],
        doc = '''Additional files, e.g., .png or .jpeg files, that the markdown
        document references.
        ''',
    ),
}

markdown_document = rule(
    implementation = _markdown_document_impl,
    attrs = _markdown_document_attrs,
    outputs = {'manifest': '%{name}.MF'},
)
