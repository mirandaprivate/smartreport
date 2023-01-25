'''Compare two file's diff via the specific binary rule.

The binary rule must has two flag params `--file1` and `--file2`.

For example:
    Good: compare.par --file1 file1.path --file2 file2.path
    Bad: compare.par  file1.path file2.path

It is most use to as the base rule of micro rule such as html_diff_test and
xml_diff_test.
'''


_SCRIPT_TMPL = '''\
#!/bin/bash -e

{comparer} \\
     --file1 {file1_path} \\
     --file2 {file2_path} \\
     {extra_args}
'''

def compare_test_impl(ctx):
    # Create the executable test script.
    ctx.actions.write(
        output = ctx.outputs.script,
        content = _SCRIPT_TMPL.format(
            comparer = ctx.executable.comparer.short_path,
            file1_path = ctx.attr.file1.files.to_list()[0].short_path,
            file2_path = ctx.attr.file2.files.to_list()[0].short_path,
            extra_args = ' '.join(ctx.attr.extra_args)
        ),
        is_executable = True,
    )

    transitive_deps = [
        ctx.attr.comparer.files,
        ctx.attr.comparer.default_runfiles.files,
        ctx.attr.file1.files,
        ctx.attr.file2.files,
    ]

    return [DefaultInfo(
        executable = ctx.outputs.script,
        runfiles = ctx.runfiles(
            transitive_files = depset(transitive = transitive_deps),
        ),
    )]

compare_test_attrs = {
    'comparer': attr.label(
        mandatory = True,
        executable = True,
        cfg = 'target',
    ),
    'file1': attr.label(
        mandatory = True,
        allow_single_file = True,
        doc = '''The path of the the actual file.

        For example, 'html1.html' refers to the `html1.html` file in the
        current directory.
        ''',
    ),
    'file2': attr.label(
        mandatory = True,
        allow_single_file = True,
        doc = '''The path of the the expected file.

        For example, 'html2.html' refers to the `html2.html` file in the
        current directory.
        ''',
    ),
    'extra_args': attr.string_list(
        doc = '''The extra args for the diff test comparer.

        For example:
        ```
        extra_args = [
            '--ignore true',
            '--skip a.txt',
        ]
        ```
        ''',

    )
}

compare_test = rule(
    implementation = compare_test_impl,
    attrs = compare_test_attrs,
    test = True,
    outputs = {
        'script': '%{name}.sh',
    },
)
