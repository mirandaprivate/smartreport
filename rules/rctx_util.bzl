'''Repository rule rctx common util.
'''


def _create_root_workspace(rctx):
    rctx.file(
        'WORKSPACE',
        "workspace(name = '%s')\n" % rctx.name,
    )


def _create_root_build(
    rctx,
    content = ''
):
    rctx.file(
        'BUILD',
        content,
    )


def _execute(
    rctx,
    cmd,
    check = True,
    verbose = False,
    **kargs,
):
    '''Check a rctx execution result.

    Args:
        cmd: cmd args arrary.
        check: Check the return_code, else return the return_code, stdout,
            stderr.
        verbose: Print the stdout.

    Returns:
        retval: The stdoutput.
    '''
    quiet = True
    if verbose:
        quiet = False
    result = rctx.execute(
        cmd,
        quiet=quiet,
        **kargs,
    )
    if not check:
        return struct(
            code = result.return_code,
            stdout = result.stdout,
            stderr = result.stderr
        )
    if result.return_code != 0:
        print('\nSTDOUT:\n%s\nSTDERR:\n%s' % (result.stdout, result.stderr))
        fail('Repository rule rctx excute failed.')
    return result.stdout


def _execute_py(
    rctx,
    script,
    args = [],
    **kargs,
):
    '''Run a python script.

    Args:
        script: python script path like `rctx.attr._dirver`.
        args: Script args.

    Returns:
        retval: The stdoutput.
    '''
    cmd = [
        'python3',
        '-c',
        rctx.read(script),
     ] + args
    return _execute(rctx, cmd, **kargs)


rctx_util = struct(
    create_root_workspace = _create_root_workspace,
    create_root_build = _create_root_build,
    execute = _execute,
    execute_py = _execute_py,
)
