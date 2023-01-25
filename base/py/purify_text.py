r'''Purify text files.


1.  In each line, remove trailing whitespace characters.
    Whitespace characters are:
            \t \v \n \r space

2.  In file lines, remove leading and trailing empty lines, i.e., the whole line
    only consists of whitespace characters.


3.  Add a UNIX new-line character \n to EOF if the EOF does not have one
    already.  The only exception to this rule is when the file is actually
    empty.


4.  Convert to UNIX line ending characters.
    This means to convert \r\n to \n.
'''

import re

__EMPTYLINE_REGEX__ = re.compile(r'^\s*$')


def fix_lines(lines):
    '''Purify a list of lines.

    Args:
        line: The list of lines to process.

    Returns:
        The purified lines, as a list of strings.
    '''
    retval = []

    # Fix each line.
    for line in lines:
        line = fix_line(line)
        retval.append(line)

    # Remove leading and trailing empty lines.
    while retval and __EMPTYLINE_REGEX__.match(retval[0]):
        retval.pop(0)
    while retval and __EMPTYLINE_REGEX__.match(retval[-1]):
        retval.pop(-1)

    return retval


def fix_line(line):
    '''Purify one line.

    :param line: The line to process.
    :type line: str.

    :return: The prified line.
    :rtype: str.
    '''
    return line.rstrip() + '\n'
