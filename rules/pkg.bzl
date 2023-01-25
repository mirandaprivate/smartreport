load(
    '@rules_pkg//:pkg.bzl',
    _pkg_tar = 'pkg_tar',
)
load(
    '@repo_vars//:vars.bzl',
	'TIME_STAMP_SECONDS',
)
def pkg_tar(
    tags = [],
    **kwargs,
):
    _pkg_tar(
        tags = tags + ['no-remote'],
		mtime = int(TIME_STAMP_SECONDS),
		portable_mtime = False,
        **kwargs,
    )