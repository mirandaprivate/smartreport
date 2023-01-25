'''Generate compiled ts for icon group.
'''

import argparse
import json
import pathlib
import hashlib

from base.py.j2.template import Template  # pylint: disable=no-name-in-module, import-error

THIS_DIR = pathlib.Path(__file__).parent
TEMPLATE = THIS_DIR / 'tmpl.j2'
EXTERNAL_PREFIX = 'external'


def _get_group_string(groups):
    '''Convert group to j2 group string.

    For example:
        ['foo'. 'bar']
        =>
        ```
            FOO,
            BAR,
        ```
    '''
    lines = []
    for group in groups:
        lines.append('    %s,' % group.upper())
    return '\n'.join(lines)


def _get_icon_string(icon):
    '''Conver a icon info to j2 icon string.

    For example:
        icon:
        {
            id: foo,
            path: bar,
            groups: ['All'],
        }
        ```
        ['foo', 'logi/bar', 'hash', [Group.ALL]],
        ```
    '''
    icon_path = icon['path']
    with open(icon_path, 'r', encoding='utf8') as f:
        icon_hash = hashlib.sha1(f.read().encode('utf8')).hexdigest()
        parts = icon_path.split('/')
        if parts[0] == EXTERNAL_PREFIX:
            parts = parts[1:]
        icon_path = '/'.join(parts)
    group_strs = []
    for group in icon['group']:
        group_strs.append('Group.%s' % group.upper())
    group_string = ', '.join(group_strs)
    return "    ['%s', '%s', '%s', [%s]]," % (
        icon['id'],
        icon_path,
        icon_hash,
        group_string,
    )


def execute(args):
    '''Execute from given args.
    '''
    with open(args.config, 'r', encoding='utf8') as f:
        config = json.loads(f.read())
    groups = []
    icon_strs = []
    for icon_info in config['icon_info_list']:
        icon_groups = icon_info['group']
        for group in icon_groups:
            if group not in groups:
                groups.append(group)
        icon_strs.append(_get_icon_string(icon_info))
    tmpl_info = {
        'groups': _get_group_string(groups),
        'data': '\n'.join(icon_strs),
    }
    with open(args.output, 'w', encoding='utf8') as f:
        template = Template(TEMPLATE)
        f.write(template.render(tmpl_info))


def main():
    parser = argparse.ArgumentParser(description='Generate compiled ts file.', )
    parser.add_argument(
        '--output',
        required=True,
        help='The output compiled ts file path.',
    )
    parser.add_argument(
        '--config',
        required=True,
        help='The config json file for generator.',
    )
  
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
