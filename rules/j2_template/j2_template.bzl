'''Generate a Jinja2 template.
'''


def _j2_template_impl(ctx):
    output_name = ctx.attr.output_name.format(
        name = ctx.label.name,
        # The .j2 suffix is guaranteed by the providers 'field' of the
        # 'template' attribute.
        template = ctx.attr.template.label.name[:-len('.j2')],
    )
    output = ctx.actions.declare_file(output_name)
    vars = None
    if ctx.attr.vars_file:
        vars = ctx.file.vars_file
    if ctx.attr.vars != {}:
        if vars != None:
            fail('Only can specific one of `vars` and `vars_file`.')
        vars = ctx.actions.declare_file('%s_vars.json' % ctx.attr.name)
        ctx.actions.write(vars, str(ctx.attr.vars))
    if vars == None:
        fail('Must specific one of `vars` and `vars_file`.')
    output = ctx.actions.declare_file(output_name)
    ctx.actions.run(
        outputs = [output],
        inputs = [
            ctx.file.template,
            vars,
        ],
        executable = ctx.executable._j2_filler,
        arguments = [
            '--template', ctx.file.template.path,
            '--vars-file', vars.path,
            '--output', output.path,
        ],
        mnemonic = 'Jinja2Template',
        progress_message = 'Generating Jinja2 Template',
    )
    return [DefaultInfo(
        files = depset(direct = [output]),
    )]

_j2_template_attrs = {
    # Alphabetically sort the attrs.
    'template': attr.label(
        mandatory = True,
        allow_single_file = True,
        providers = ['.j2'],
        doc = 'The .j2 file to fill.',
    ),
    'vars': attr.string_dict(
        doc = '''The simple string dict for j2_template.

        It is excusive with attr `vars_file`.
        ''',
    ),
    'vars_file': attr.label(
        allow_single_file = True,
        doc = '''The json/yaml file containing the object used to fill the
        template.''',
    ),
    'output_name': attr.string(
        default = '{template}',
        doc = '''The file name of the generated file.  Support the following
        python format variables:
            {name}          The name of this target.
            {template}      The name of the template, less the .j2 suffix.
        '''
    ),
    '_j2_filler': attr.label(
        default = Label('//rules/j2_template:j2_filler'),
        executable = True,
        cfg = 'target',
    )
}

j2_template = rule(
    implementation = _j2_template_impl,
    attrs = _j2_template_attrs,
)
