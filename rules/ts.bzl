'''
Convenience rule for running .ts binaries.
'''

load(
    ':ts_library.bzl',
    _ts_library = 'ts_library',
)
load(
    ':ts_binary.bzl',
    _ts_binary = 'ts_binary',
)
load(
    '//rules/ts_node_test:ts_node_test.bzl',
    _ts_node_test = 'ts_node_test',
)

ts_library = _ts_library
ts_binary = _ts_binary
ts_node_test = _ts_node_test