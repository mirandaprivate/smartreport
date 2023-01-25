'''Verify that the content of two json files.
'''

load(
    '//rules/diff_test:compare_test.bzl',
    'compare_test',
)


def json_diff_test(
        name,
        file1,
        file2,
        testonly = True,
        size = 'small',
        visibility = None,
        tags = [],
    ):
    '''Test the content of two htmls

    Args:
        name: target name.
        file1: actual html file.
        file2: expected html file.
        testonly: The testonly flag.
        size: test size.
        visibility: Target visibilit.
        tags: Target tags.
    '''
    compare_test(
        comparer = Label('//rules/diff_test/json_diff_test'),
        name = name,
        file1 = file1,
        file2 = file2,
        size = size,
        tags = tags,
        testonly = testonly,
        visibility = visibility,
    )
