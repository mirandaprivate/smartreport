'''Fill Jinja2 templates.
'''

import pathlib

from typing import (
    Union,
    Dict,
)

import jinja2


class Template:  # pylint: disable=too-few-public-methods
    '''A Jinja2 template.

    The added value is the ability to quickly to quickly re-use a template with
    different sets of variables.
    '''

    def __init__(self, j2_template: Union[pathlib.Path, str], *, filters={}):
        j2_path = pathlib.Path(j2_template)
        assert j2_path.is_file(), j2_path
        j2_env = jinja2.Environment(
            loader=jinja2.FileSystemLoader([str(j2_path.parent)]),
            keep_trailing_newline=True,
            lstrip_blocks=True,
            trim_blocks=True,
        )
        j2_env.filters.update(filters)
        self._j2_template = j2_env.get_template(j2_path.name)

    def render(self, j2_vars: Dict[str, str]) -> str:
        '''Render the template for the given vars.

        Args:
            j2_vars: A dictionary of all variables available while rendering
                the template for this host.

        Returns:
            A string containing the rendered content.
        '''
        return self._j2_template.render(j2_vars)
