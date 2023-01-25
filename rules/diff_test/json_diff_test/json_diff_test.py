import argparse
import re
import json

from logi.base.py import diff


def execute(args):  # pylint: disable=missing-docstring
    with open(args.file1, 'r', encoding='utf8') as f:
        file1 = json.loads(f.read())
        file1_dumped = json.dumps(
            file1, indent=4, sort_keys=True, ensure_ascii=False
        )

    with open(args.file2, 'r', encoding='utf8') as f:
        file2 = json.loads(f.read())
        file2_dumped = json.dumps(
            file2, indent=4, sort_keys=True, ensure_ascii=False
        )

    if file1_dumped == file2_dumped:
        exit(0)
    diff_str = diff.diff_string(file1_dumped, file2_dumped)
    print(diff_str)
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
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
