'''Bzl function args common util.
'''
_TESTONLY = 'testonly'
_VISIBILITY = 'visibility'
_TAGS = 'tags'
_SIZE = 'size'

CommonArgsInfo = provider(
    fields = {
        _TESTONLY: 'Defalut is false',
        _VISIBILITY: 'Default is none',
        _TAGS: 'Default is empty list',
    }
)

TestArgsInfo = provider(
    fields = {
        _TESTONLY: 'Defalut is true',
        _VISIBILITY: 'Default is none',
        _TAGS: 'Default is empty list',
        _SIZE: 'Default is small',
    }
)

def _get_common_args(**kargs):
    '''Read from kargs, and get return CommonArgsInfo.
    '''
    testonly = kargs[_TESTONLY] if _TESTONLY in kargs else False
    visibility = kargs[_VISIBILITY] if _VISIBILITY in kargs else None
    tags = kargs[_TAGS] if _TAGS in kargs else []
    return CommonArgsInfo(
        testonly = testonly,
        visibility = visibility,
        tags = tags,
    )

def _get_test_args(**kargs):
    '''Read from kargs, and get return TestArgsInfo.
    '''
    testonly = kargs[_TESTONLY] if _TESTONLY in kargs else True
    visibility = kargs[_VISIBILITY] if _VISIBILITY in kargs else None
    tags = kargs[_TAGS] if _TAGS in kargs else []
    size = kargs[_SIZE] if _SIZE in kargs else 'small'
    return TestArgsInfo(
        testonly = testonly,
        visibility = visibility,
        tags = tags,
        size = size,
    )

function = struct(
    get_common_args = _get_common_args,
    get_test_args = _get_test_args,
)
