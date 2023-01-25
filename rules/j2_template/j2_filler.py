'''Fill a Jinja2 template from a vars json file.
'''

import argparse
import yaml

from base.py.j2.filters import urlsplit
from base.py.j2.template import Template


def execute(args):  # pylint: disable=missing-docstring
    with open(args.vars_file, encoding='utf8') as f:
        data = yaml.safe_load(f.read())
    filters = dict(urlsplit=urlsplit)
    template = Template(
        args.template,
        filters=filters,
    )
    content = template.render(data)
    with open(args.output, 'w', encoding='utf8') as f:
        f.write(content)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--template', required=True, help='The path to the Jinja2 template.'
    )
    parser.add_argument(
        '--vars-file',
        required=True,
        help='The json/yaml file to read for variable.',
    )
    parser.add_argument(
        '-o',
        '--output',
        required=True,
        help='The file to output to.',
    )
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
