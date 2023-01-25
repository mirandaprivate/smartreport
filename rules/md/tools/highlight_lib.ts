/**
 * Convert a source file into an html file.
 *
 * For example,
 *      foo.ts => foo_ts.html
 */

import {readFileSync, writeFileSync} from 'fs'
import {extname, join} from 'path'

import {highlightCodeBlock} from './lib'

/**
 * Determines the command line arguments for the current Bazel action. Since
 * this action can have a large set of input files, Bazel may write the
 * arguments into a parameter file. This function is responsible for handling
 * normal argument passing or Bazel parameter files.
 *
 * Read more here:
 *  https://docs.bazel.build/versions/master/skylark/lib/Args.html#use_param_file
 */
function getBazelActionArguments(): readonly string[] {
    // tslint:disable-next-line: no-magic-numbers
    const args = process.argv.slice(2)
    /**
     * If Bazel uses a parameter file, we've specified that it passes the file
     * in the following:
     * format: "arg0 arg1 --param-file={path_to_param_file}"
     */
    if (args[0].startsWith('--param-file='))
        return readFileSync(args[0].split('=')[1], 'utf8').trim().split('\n')

    return args
}

export function highlight(): void {
    const [bazelBinPath, ...inputFiles]: readonly string[] =
        getBazelActionArguments()
    inputFiles.forEach((inputPath: string) => {
        const fileExtension = extname(inputPath).substring(1)
        const baseOutputPath = inputPath.replace(
            `.${fileExtension}`,
            `_${fileExtension}.html`,
        )
        const outputPath = join(bazelBinPath, baseOutputPath)
        const htmlOutput = highlightCodeBlock(readFileSync(inputPath, 'utf8'))
        writeFileSync(outputPath, htmlOutput)
    })
}
