workspace(name='logi')
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

git_repository(
    name = "rules_python",
    # commit = "v3.19.0",
    commit = "76ef44f",
    remote = "https://gitee.com/dinshan/rules_python",
    # remote = "https://github.com/bazelbuild/rules_python",
)
load('@rules_python//python:pip.bzl','pip_install')
pip_install(
    name = 'pip',
    extra_pip_args = ['-i', 'https://mirrors.aliyun.com/pypi/simple/'],
    requirements = '//:py_requirements.txt',
)

# rules_proto defines abstract rules for building Protocol Buffers.
http_archive(
    name = "rules_proto",
    sha256 = "2490dca4f249b8a9a3ab07bd1ba6eca085aaf8e45a734af92aad0c42d9dc7aaf",
    strip_prefix = "rules_proto-218ffa7dfa5408492dc86c01ee637614f8695c45",
    urls = [
        "https://github.com/bazelbuild/rules_proto/archive/218ffa7dfa5408492dc86c01ee637614f8695c45.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "2b1641428dff9018f9e85c0384f03ec6c10660d935b750e3fa1492a281a53b0f",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.29.0/rules_go-v0.29.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.29.0/rules_go-v0.29.0.zip",
    ],
)

http_archive(
    name = "bazel_gazelle",
    sha256 = "de69a09dc70417580aabf20a28619bb3ef60d038470c7cf8442fafcf627c21cb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
    ],
)

# http_archive(
#     name = "com_google_protobuf",
#     sha256 = "bf0e5070b4b99240183b29df78155eee335885e53a8af8683964579c214ad301",
#     strip_prefix = "protobuf-3.14.0",
#     urls = ["https://github.com/protocolbuffers/protobuf/archive/v3.14.0.zip"],
# )
git_repository(
    name = "com_google_protobuf",
    # commit = "v3.19.0",
    commit = "17b30e9",
    remote = "https://gitee.com/dinshan/com_google_protobuf",
    # remote = "http://git-mirror.corp.logiocean.com/googleapis/googleapis",
)

git_repository(
    name = "com_google_googleapis",
    # commit = "v2.7.0",
    commit = "f8a2901",
    # remote = "https://github.com/googleapis/googleapis",
    remote = "https://gitee.com/dinshan/com_google_googleapis",
)

git_repository(
    name = "rules_proto_grpc",
    # commit = "4.1.0",
    commit = "f303fa8",
    remote = "https://gitee.com/dinshan/rules_proto_grpc",
    # remote = "https://github.com/rules-proto-grpc/rules_proto_grpc",
)

load("@rules_proto_grpc//:repositories.bzl", "rules_proto_grpc_repos", "rules_proto_grpc_toolchains")

rules_proto_grpc_toolchains()

rules_proto_grpc_repos()

git_repository(
    name = "grpc_ecosystem_grpc_gateway",
    # commit = "v2.7.2",
    commit = "9ee0d1f",
    remote = "https://gitee.com/dinshan/grpc_ecosystem_grpc_gateway",
    # remote = "https://github.com/grpc-ecosystem/grpc-gateway",
)

git_repository(
    name = "com_github_envoyproxy_protoc_gen_validate",
    # commit = "v0.6.1",
    commit = "758c5fc",
    remote = "https://gitee.com/dinshan/com_github_envoyproxy_protoc_gen_validate",
    # remote = "https://github.com/envoyproxy/protoc-gen-validate",
)


load("//:deps.bzl", "go_dependencies")

# gazelle:repository_macro deps.bzl%go_dependencies
go_dependencies()

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.17.2")

gazelle_dependencies()

git_repository(
    name = "io_bazel_rules_docker",
    # commit = "v0.20.0",
    commit = "af2b074",
    remote = "https://gitee.com/dinshan/rules_docker",
    # remote = "https://github.com/bazelbuild/rules_docker",
    patches = ['//patches:io_bazel_rules_docker.patch'],
    patch_args = ['-p1']
)
load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)
container_repositories()
load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")
container_deps()

# load(
#     "@io_bazel_rules_docker//container:container.bzl",
#     "container_pull",
# )

# container_pull(
#   name = "ubuntu_base",
#   registry = "index.docker.io",
#   repository = "library/ubuntu",
#   # 'tag' is also supported, but digest is encouraged for reproducibility.
# #   digest = "sha256:81d5a916",
#   tag = "18.04",
# )

load(
    '@io_bazel_rules_docker//container:container.bzl',
    'container_load',
)

container_load(
    name = 'ubuntu_base',
    visibility = ['//visibility:public'],
    file = '//docker:ubuntu-18.04-ca.tar',
)

container_load(
    name = 'nginx_base',
    visibility = ['//visibility:public'],
    file = '//docker:nginx.tar',
)


http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "6f15d75f9e99c19d9291ff8e64e4eb594a6b7d25517760a75ad3621a7a48c2df",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.7.0/rules_nodejs-4.7.0.tar.gz"],
    patches = ['//patches:build_bazel_rules_nodejs.patch'],
    patch_args = ['-p1']
)


load("@build_bazel_rules_nodejs//:index.bzl", "check_rules_nodejs_version", "node_repositories", "yarn_install")

check_rules_nodejs_version(minimum_version_string = "2.2.0")

# Setup the Node.js toolchain
node_repositories(
    node_version = "14.17.3",
    package_json = ["//:package.json"],
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@build_bazel_rules_nodejs//toolchains/esbuild:esbuild_repositories.bzl", "esbuild_repositories")

esbuild_repositories(npm_repository = "npm")


git_repository(
    name = "io_bazel_rules_sass",
    commit = "c2a255f",
    remote = "https://e.coding.net/dingshan/rules_sass/rules_sass.git",
    # remote = "https://github.com/bazelbuild/rules_sass",
)

load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories()

load('//rules:repo_vars.bzl','repo_vars')

repo_vars(
    name = "repo_vars",
    src = '//:tsconfig.json',
    track_file = '//:build/time.txt'
)