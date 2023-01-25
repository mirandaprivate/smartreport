'''Current repo vars.

'''
load(
    '//rules:rctx_util.bzl',
    'rctx_util',
)

def _repo_vars_impl(rctx):
    # Read track file content but doing nothing, in order to follow the track
    # file's change.
    rctx.read(rctx.attr.track_file)

    rctx_util.create_root_workspace(rctx)
    rctx_util.create_root_build(rctx)
    REPO_DIR = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'cd $(dirname %s) && git rev-parse --show-toplevel' %
            rctx.path(rctx.attr.src),
    ]).strip('\n')

    # Create vars.bzl.
    timestamp = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'echo $(date +%F-%T:%N)',
    ]).strip('\n')
    timestamp_seconds = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'echo $(date +%s)',
    ]).strip('\n')
    head = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'cd %s && git rev-parse HEAD' % REPO_DIR,
    ]).strip('\n')
    head_time = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'cd %s && git show -s --format=%%ci HEAD' % REPO_DIR,
    ]).strip('\n')
    branch = rctx_util.execute(rctx, [
        'sh',
        '-c',
        'cd %s && git rev-parse --abbrev-ref HEAD' % REPO_DIR,
    ]).strip('\n')
    if branch == 'HEAD':
        branch = ''

    tag_result  = rctx.execute([
        'sh',
        '-c',
        'cd %s && ' % REPO_DIR +
        "git describe --exact-match --tags $(git log -n1 --pretty='%h')",
    ])
    tag = ''
    if tag_result.return_code == 0:
        tag = tag_result.stdout.strip('\n')
    vars_dict = {
        'TIME_STAMP': timestamp,
        'TIME_STAMP_SECONDS': timestamp_seconds,
        'GIT_HEAD': head,
        'GIT_HEAD_TIME': head_time,
        'GIT_BRANCH': branch,
        'GIT_TAG': tag,
    }
    _create_dict_bzl(rctx, vars_dict, 'vars.bzl')


def _create_dict_bzl(rctx, dict_obj, out):
    content = ''
    for key, value in dict_obj.items():
        if type(value) == 'string':
            content = content + "%s = '%s'\n" % (key, value)
        else:
            content = content + '%s = %s\n' % (key, str(value))
    rctx.file(
        out,
        content,
    )


repo_vars = repository_rule(
    implementation = _repo_vars_impl,
    attrs = {
        'src': attr.label(
            mandatory = True,
            doc = 'A file in repo root dir',
        ),
        'track_file': attr.label(
            mandatory = True,
            doc = 'A file would changed after each build',
        ),
    },
)
