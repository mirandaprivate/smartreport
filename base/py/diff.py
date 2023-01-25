'''Generate diff strings.
'''

import difflib

from typing import Iterable

from base.py import colorize


def diff_string(s1: str, s2: str, *, file1: str = '', file2: str = '') -> str:  # pylint: disable=invalid-name
    '''Get a unified diff string comparing two strings.
    '''
    retval = ''
    diff: Iterable[str] = difflib.unified_diff(
        s1.split('\n'),
        s2.split('\n'),
        fromfile=file1,
        tofile=file2,
    )
    for line in diff:
        line = line + '\n'
        if line.startswith('+'):
            retval += colorize.green(line)
        elif line.startswith('-'):
            retval += colorize.red(line)
        elif line.startswith('^'):
            retval += colorize.blue(line)
        else:
            retval += line
    return retval
