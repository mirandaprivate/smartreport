'''Comman filter use for j2 template.
'''

import re
from urllib.parse import urlparse
import yaml
import json


def regex_replace(string: str, find: str, replace: str) -> str:
    '''A non-optimal implementation of a regex filter.

    This is a corresponding filter of `regex_replace` filter at ansible.

    Args:
        string: original string.
        find: regex represent the str want to find.
        replace: the content replace the find string.

    Returns:
        The string after replace.
    '''
    return re.sub(find, replace, string)


def urlsplit(
    url: str,
    part,
) -> str:
    '''Extract specific part from a url.

    This is a corresponding filter of `urlsplit` filter at ansible.

    Args:
        url: The original url to work with.
        part: The part of the url to extract.  Valid values are taken from:
            https://docs.python.org/3/library/urllib.parse.html

    Returns:
        The specific part after split.
    '''
    return getattr(urlparse(url), part)


def to_nice_yaml(string: str, **kargs) -> str:
    '''Purify the yaml content.

    This is a corresponding filter of `to_nice_yaml` filter at from ansible.

    Args:
        string: orginal string.

    Returns:
        formatted yaml content.
    '''
    if not isinstance(string, str):
        return ''
    content = yaml.load(string)
    return yaml.dump(content, **kargs)


def to_json(string: str, **kargs) -> str:
    '''Purify the json content.

    This is a corresponding filter of `to_json` filter at from ansible.

    Args:
        string: orginal string.

    Returns:
        formatted json content.
    '''
    if not isinstance(string, str):
        return ''
    content = json.loads(string)
    return json.dumps(content, **kargs)
