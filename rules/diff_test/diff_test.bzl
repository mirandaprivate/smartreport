'''Verify that the content of two files.
'''

load(
    ':compare_test.bzl',
    'compare_test',
)


def diff_test(
        name,
        file1,
        file2,
        error_message = '',
        ignore_trailing_whitespaces = False,
        testonly = True,
        visibility = None,
        size = 'small',
        tags = [],
    ):
    '''Test the content of two files.

    Args:
        name: target name.
        file1: actual file.
        file2: expected file.
        error_message: the hint displayed when the diff_test is failed.
        ignore_trailing_whitespaces: ignore the trailing withsapce when
            compare.
        testonly: The testonly attribute for test targets.
        size: test size.
    '''
    args = []
    if error_message != '':
        args.append('--error-message "%s"' % error_message)
    if ignore_trailing_whitespaces:
        args.append('--ignore-trailing-whitespaces true')
    compare_test(
        comparer = Label('//rules/diff_test:diff_test'),
        name = name,
        file1 = file1,
        file2 = file2,
        size = size,
        testonly = testonly,
        extra_args = args,
        visibility = visibility,
        tags = tags,
    )
