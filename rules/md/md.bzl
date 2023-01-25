load(
    '//rules/md:markdown_document.bzl',
    _markdown_document = 'markdown_document',
)
load(
    '//rules/md:markdown_group.bzl',
    _markdown_group = 'markdown_group',
)
load(
    '//rules/md:markdown_group_to_html.bzl',
    _markdown_group_to_html = 'markdown_group_to_html',
)
load(
    '//rules/md:markdown_group_to_menu.bzl',
    _markdown_group_to_menu = 'markdown_group_to_menu',
)
load(
    '//rules/md:markdown_to_html.bzl',
    _markdown_to_html = 'markdown_to_html',
)

# Rules.
markdown_document = _markdown_document
markdown_group = _markdown_group
markdown_group_to_html = _markdown_group_to_html
markdown_group_to_menu = _markdown_group_to_menu
markdown_to_html = _markdown_to_html
