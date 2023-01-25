'''Bazel actions to copy a file.
'''
_COPY_TMPL = '''\
#!/bin/bash

cp -rf {src} {dst}
'''


def copy_file(
    ctx,
    src,
    dst,
    script_name = '',
):
    script_name = script_name or '%s.sh' % ctx.attr.name
    script = ctx.actions.declare_file(script_name)
    ctx.actions.write(
        output = script,
        content = _COPY_TMPL.format(
            src = src.path,
            dst = dst.path,
        ),
        is_executable = True,
    )
    ctx.actions.run(
        inputs = depset([src]),
        outputs = [dst],
        executable = script,
    )
