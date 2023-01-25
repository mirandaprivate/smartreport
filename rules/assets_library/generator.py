'''Generate compiled ts for assets_library.
'''

import argparse
import pathlib

from logi.base.py.j2.template import Template  # pylint: disable=no-name-in-module

THIS_DIR = pathlib.Path(__file__).parent
TS_TEMPLATE = THIS_DIR / 'ts_tmpl.j2'
SCSS_TEMPLATE = THIS_DIR / 'scss_tmpl.j2'


def execute(args):
    '''Execute from given args.
    '''
    upper_files = []
    for f in args.srcs:
        fpath = pathlib.Path(f)
        name = fpath.name\
            .replace('-', '_')\
            .replace('.', '_')\
            .replace('@', '_')\
            .upper()
        upper_files.append({'name': name, 'path': fpath})
    ts_tmpl_args = {
        'files': upper_files,
    }
    with open(args.output_ts, 'w', encoding='utf8') as f:
        template = Template(TS_TEMPLATE)
        f.write(template.render(ts_tmpl_args))

    lower_files = []
    for f in upper_files:
        lower_files.append({
            'name': f['name']\
                .replace('_', '-')\
                .lower(),
            'path': f['path'],
        })
    scss_tmpl_args = {
        'files': lower_files,
    }
    with open(args.output_scss, 'w', encoding='utf8') as f:
        template = Template(SCSS_TEMPLATE)
        f.write(template.render(scss_tmpl_args))


def main():
    parser = argparse.ArgumentParser(description='Generate compiled ts file.', )
    parser.add_argument(
        '--output-ts',
        required=True,
        help='The output compiled ts file path.',
    )
    parser.add_argument(
        '--output-scss',
        required=True,
        help='The output compiled scss file path.',
    )
    parser.add_argument(
        '--srcs',
        nargs='+',
        required=True,
    )
    parser.add_argument(
        '--workspace',
        required=True,
        help='Current workspace name.',
    )
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
