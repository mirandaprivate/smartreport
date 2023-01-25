'''Copy genetated go files.
'''

import argparse
import pathlib
import os
import shutil

BAZEL_PREFIX = 'bazel-out/k8-fastbuild/bin'
BAZEL_PREFIX_HOST = 'bazel-out/host/bin'
BAZEL_BIN = 'build/bin'


def execute(args):
    '''Execute args.
    '''
    repo_root = pathlib.Path(args.repo)
    out_lines = []
    for file in args.inputs:
        if not file.endswith('.go'):
            continue
        src = pathlib.Path(file)
        if str(src).startswith(BAZEL_PREFIX) or \
            str(src).startswith(BAZEL_PREFIX_HOST):
            short_path = get_short_path(
                file_path=src,
                file_type=args.type,
                workspace=args.workspace,
            )
        else:
            short_path = src
        dst = repo_root / short_path
        if os.path.exists(dst):
            os.remove(dst)
        os.makedirs(dst.parent, exist_ok=True)
        shutil.copy(src, dst)
        bazel_path = repo_root / BAZEL_BIN / short_path
        out_lines.append('%s > %s\n' % (bazel_path, dst))
    with open(args.output, 'w', encoding='utf8') as f:
        f.write(''.join(out_lines))


def get_short_path(
    *,
    file_path,
    file_type,
    workspace,
):
    '''Get a relative path via the file_path under the bazel.

    For example:
    type: normal
    bazel-out/k8-fastbuild/bin/api/proto/abc/api.pb.go
        => api/proto/abc/api.pb.go

    type: proto
    bazel-out/k8-fastbuild/bin/api/proto/abc/api.pb.go_/logi/api/proto/abc/api/api.pb.go
        => api/proto/abc/api/api.pb.go
    '''
    if file_type == 'normal':
        if str(file_path).startswith(BAZEL_PREFIX):
            return file_path.relative_to(BAZEL_PREFIX)
        if str(file_path).startswith(BAZEL_PREFIX_HOST):
            return file_path.relative_to(BAZEL_PREFIX_HOST)
    if file_type == 'proto':
        return str(file_path).split('_/%s/' % workspace)[-1]
    raise Exception('Not support type %s' % file_type)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--repo',
        required=True,
        help='The repo path.',
    )
    parser.add_argument(
        '--inputs',
        required=True,
        nargs=argparse.ONE_OR_MORE,
        help='The file which can used to locate the repo path.',
    )
    parser.add_argument(
        '--output',
        required=True,
        help='The file use record which file has copied.',
    )
    parser.add_argument(
        '--workspace',
        required=True,
        help='The workspace name.',
    )
    parser.add_argument(
        '--type',
        choices=['normal', 'proto'],
        default='normal',
        help='''The type of the input go files.

        The normal go files path like below:
        `bazel-out/k8-fastbuild/bin/api/proto/abc/api.pb.go`

        The proto go files path like below:
        `bazel-out/k8-fastbuild/bin/api/proto/abc/api.pb.go_/logi/api/proto/abc/api/api.pb.go`
        ''',
    )
    args = parser.parse_args()
    execute(args)


if __name__ == '__main__':
    main()
