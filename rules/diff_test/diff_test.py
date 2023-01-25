import argparse
import re
import textwrap

from base.py import diff
from base.py import purify_text


def execute(args):  # pylint: disable=missing-docstring
    ignore = args.ignore_trailing_whitespaces
    file1_lines = []
    with open(args.file1, 'r', encoding='utf8') as f:
        file1_lines = f.readlines()
        if ignore:
            file1_lines = purify_text.fix_lines(file1_lines)

    file2_lines = []
    with open(args.file2, 'r', encoding='utf8') as f:
        file2_lines = f.readlines()
        if ignore:
            file2_lines = purify_text.fix_lines(file2_lines)

    file1_str = '\n'.join(file1_lines)
    file2_str = '\n'.join(file2_lines)
    if file1_str == file2_str:
        exit(0)
    diff_str = diff.diff_string(file1_str, file2_str)
    print(diff_str)
    if args.error_message:
        dedent_message = textwrap.dedent(args.error_message)
        print(dedent_message)
    exit(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--file1',
        help='Compare file1.',
        required=True,
    )
    parser.add_argument(
        '--file2',
        help='Compare file2.',
        required=True,
    )
    parser.add_argument(
        '--ignore-trailing-whitespaces',
        default=False,
        help='Comparing would ignogre trainling whitespaces'
    )
    parser.add_argument(
        '--error-message',
        default=None,
        help='The message displayed when the diff test is failed',
    )
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
