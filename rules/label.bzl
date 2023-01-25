'''Allow Bazel labels to use relative paths in package-names.

Bazel labels are defined here:
        https://docs.bazel.build/versions/master/build-ref.html

The lexical spec of Bazel labels consists of three components:
        <repository-name>//<package-name>:<target-name>

Detailed explanation of each of the three names:

    repository-name:

        External repositories are usually loaded via rules such as http_archive,
        git_archive, local_repository.  The repository-name of external
        repositories are defind in the 'name' field of those rules, prefixed
        with the at-sign '@'.  For example:
                # repository_name() == '@foo'
                local_repository(name = 'foo', ...)

        The main repository uses the at-sign, '@' as the repository-name.  Note
        that repository-name is not workspace-name, which is defined via the
        following statement in WORKSPACE:
                workspace(name = 'name-of-the-workspace')

        The repository-name may be omitted, that is, the following two forms
        have the same meaning:
                @//<package-name>:<target-name>
                //<package-name>:<target-name>

    package-name:

        The name of the package is a Unix-path like string made entirely of a-z,
        A-Z, 0-9, '/', '-', '.', and '_', with some additional lexical rules.
        Notably, a package-name MUST NOT:
            a)  start with a slash,
            b)  contain the substring '//',
            c)  end with a slash, or
            d)  use relative paths, i.e., '..' and './' in the Unix path.

        For example, the following are valid package-names:
                foo
                foo/bar

        On the contrary, the following are invalid package-names:
                /foo/bar
                foo/bar/../../lib

        When referencing a target defined in the same package, the package name
        may be omitted.  For example, in foo/bar/BUILD, the following three labels
        have the same meaning:
                lib
                :lib
                //foo/bar:lib

    target-name:

        The name of the target defined in the package.

        Only a-z, A-Z, 0-9, and the punctuation characters _/.+-=,@~ are allowed.

        If the target-name is the same as the last component of the
        package-name, the target-name may be omitted.  For example, the
        following two labels are the same:
                //foo/bar
                //foo/bar:bar
'''

def workspace(ipath):
    return split_label(ipath)[0]

def package_dir(ipath):
    return split_label(ipath)[1]

def target(ipath):
    return split_label(ipath)[2]

def label(ipath):
    '''Resolve a Bazel label string and convert to the vanilla Bazel format.

    In addition to the vanilla Bazel labels, we allow the following extensions:

        Package-names may contain relative paths.

        Such paths are resolved relative to the package-name that defines the
        relative paths.  For example, in //foo/BUILD,
                ./bar:lib       is resolved to      //foo/bar:lib
                ..:lib          is resolved to      //:lib
                ../core:lib     is resolved to      //core:lib

        Note that in vanilla Bazel, 'foo' is the same as ':foo'. So that
                bar             is resolved to      //foo:bar
                ./bar           is resolved to      //foo/bar:bar
                ./bar:lib       is resolved to      //foo/bar:lib
                bar:lib         is an invalid input

    Args:
        ipath: An extended Bazel label string.

    Returns:
        The vanilla Bazel label string.
    '''
    retval = '%s//%s:%s' %  split_label(ipath)
    return retval

def split_label(raw_label):
    '''Parse a Bazel label into workspace-name, package-name, and target-name.

    The lexical rules are specified in the docstring of the label() function.

    This function is fully covered by ./bazel_label_test.py, as can be run via
    `bazel test`.

    Args:
        raw_label: A string matching the extended Bazel label grammar.

    Returns:
        A 3-tuple, (workspace, package, target).
    '''
    # TODO (zhongming): Rewrite this function with a DFA.

    data = raw_label
    # 1.  Find workspace-name
    #
    # Safe to search for '//' to determine the workspace_name because neither
    # package-names nor target-names may contain the substring '//'.
    if '//' in data:
        toks = data.split('//')
        if toks[0] == '':
            workspace_name = ''
        else:
            workspace_name = '@' + toks[0][1:]
        data = toks[1]
        explicit_workspace_name = True
    else:
        # Must start with either a column ':' (the shorthand for referencing
        # targets in the same package), or the beginning of a package-name, or
        # '.' (extended relative path).
        workspace_name = ''
        explicit_workspace_name = False

    # Hereafter, data does not contain the workspace_name, i.e., either
    # it is stripped or it does not exist to begin with.

    # 2.  Find package-name and target-name
    #
    # TODO (zhongming): This part is highly convoluted because of the need to
    # comply with vanilla Bazel's convention of resolving 'bar' inside
    # //foo/BUILD to foo:bar.  Should write a DFA to formalize this entire
    # function.
    if ':' in data:
        package_name, target_name = data.split(':')
        if target_name:
            # In //foo/BUILD, ':bar' and '//:bar' should resolve to //foo:bar
            # and //:bar respectively.
            #
            # In //foo/BUILD, 'bar:lib' and './bar:lib' should resolve to
            # //foo/bar:lib, '//bar:lib' and './bar:lib' should resolve to
            # //bar:lib.
            package_name = __get_full_package_name(
                pkgname = package_name,
                explicit_workspace_name = explicit_workspace_name,
            )
        else:
            # In //foo/BUILD, 'bar:' and '//bar:' are errors.
            pass
        package_name = normpath(package_name)
    else:
        #
        if data.startswith('.'):
            # In //foo/BUILD, './bar' should resolve to //foo/bar:bar.
            package_name = normpath(native.package_name() + '/' + data)
            target_name = package_name.split('/')[-1]
        else:
            if explicit_workspace_name:
                # In //foo/BUILD, '//bar' should resolve to //bar:bar.
                package_name = data
                target_name = data.split('/')[-1]
            else:
                # In //foo/BUILD, 'bar' should resolve to //foo:bar.
                package_name = native.package_name()
                target_name = data

    return workspace_name, package_name, target_name


def normpath(path):
    '''Normalize a Unix path.

    Resolve ./ and ../ in a path.
                bar:lib         is resolved to      //foo/bar:lib
                ./bar:lib       is resolved to      //foo/bar:lib
                ..:lib          is resolved to      //:lib
                ../core:lib     is resolved to      //core:lib

    Args:
        path: A Unix path string.

    Returns:
        The normalized Unix path string.
    '''
    # The stack of path components.  The last element is the top of stack.
    s = []

    toks = path.split('/')

    for tok in toks:
        if tok == '.' or tok == '':
            continue
        elif tok == '..':
            s.pop(-1)
        else:
            # Cannot use s.push(tok) because Skylark does not support it.
            s += [tok]
    return '/'.join(s)


def __get_full_package_name(
        pkgname,
        *,
        explicit_workspace_name=True,
    ):
    if not explicit_workspace_name:
        return native.package_name() + '/' + pkgname
    else:
        return pkgname

def go_module_name(append = ''):
    '''
    Default module name for go library.

    Args:
        suffix: The module name suffix.

    Returns:
        default module name.
    '''
    parts = [
        'logi',
        native.package_name(),
    ]
    if append:
        parts.append(append)
    return '/'.join(parts)


'''Generate a default module_name for ng_module and ts_library target.

'''
def module_name(prefix = ''):
    '''
    Default module name is path of target's directory with prefix '@logi/'.

    For example:
        ng_module target in '//src/web/components/samples/foo/BUILD'.
        it's default module_name is '@logi/src/web/components/samples/foo'.

    Args:
        prefix: The module name prefix.

    Returns:
        default module name.
    '''
    prefix = prefix or 'logi'
    return '@' + prefix + '/' + native.package_name()

