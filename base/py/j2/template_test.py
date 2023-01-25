'''Test all ansible jinja2 templates without running ansible.
'''

import unittest
import pathlib
import json

from template import Template

from filters import urlsplit

THIS_DIR = pathlib.Path(__file__).parent
TEST_DIR = THIS_DIR / 'test_data'
VARS_JSON = TEST_DIR / 'vars.json'
TEST_J2 = TEST_DIR / 'test.j2'
GOLDEN_TXT = TEST_DIR / 'test.golden.txt'


class TestTemplates(unittest.TestCase):
    ''' Template test.
    '''

    def test_templates(self):  # pylint: disable=no-self-use
        ''' Test the j2 can render successfully.
        '''
        filters = dict(urlsplit=urlsplit)
        template = Template(TEST_J2, filters=filters)
        with open(VARS_JSON, 'r') as f:
            render_vars = json.loads(f.read())
        with open(GOLDEN_TXT, 'r') as f:
            exptected = f.read()
        actual = template.render(render_vars)
        self.assertEqual(actual, exptected)


if __name__ == '__main__':
    unittest.main()
