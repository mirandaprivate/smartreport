/**
 * Script that will be used by the markdown_to_html Bazel rule in order to
 * transform multiple markdown files into the equivalent HTML output.
 */

import {readFileSync, writeFileSync} from 'fs'
// tslint:disable-next-line: no-wildcard-import
import marked from 'marked'
// tslint:disable-next-line: no-duplicate-imports
import {Renderer, setOptions} from 'marked'

import {highlightCodeBlock} from './lib'

/**
 * Regular expression that matches whitespace.
 */
const WHITESPACE_REGEXP = /\W+/g

/**
 * Regular expression that matches example comments.
 */
const EXAMPLE_COMMENT_REGEXP = /<!--\W*example\(([^)]+)\)\W*-->/g

/**
 * Custom renderer for marked that will be used to transform markdown files to
 * HTML files that can be used in the Angular Material docs.
 */
export class DocsMarkdownRenderer extends Renderer {
    /**
     * Transforms a markdown heading into the corresponding HTML output. In our
     * case, we want to create a header-link for each H3 and H4 heading. This
     * allows users to jump to specific parts of the docs.
     */
    // tslint:disable-next-line
    public heading(label: string, level: number, _raw: string): string {
        const headingId = label.toLowerCase().replace(WHITESPACE_REGEXP, '-')
        return `
            <h${level} id="${headingId}" class="docs-header-link">
                <span header-link="${headingId}"></span>
                ${label}
            </h${level}>
        `
    }

    /**
     * Method that will be called whenever inline HTML is processed by marked.
     * In that case, we can easily transform the example comments into real HTML
     * elements. For example:
     *
     *  `<!-- example(name) -->` is converted into
     *              `<div material-docs-example="name"></div>`
     */
    public html(html: string): string {
        const tmp = html.replace(
            EXAMPLE_COMMENT_REGEXP,
            // tslint:disable-next-line: naming-convention ext-variable-name
            (_match: string, name: string): string =>
                `<div material-docs-example="${name}"></div>`,
        )

        return super.html(tmp)
    }
}

export function toHtml(): void {
    const renderer = new DocsMarkdownRenderer()
    setOptions({
        highlight: highlightCodeBlock,
        renderer,
    })
    // tslint:disable-next-line: no-magic-numbers
    const inputFiles: readonly string[] = process.argv.slice(2)

    inputFiles.forEach((inputPath: string): void => {
        const parts = inputPath.split(':')
        const mdFile = parts[1]
        const outputPath = parts[0]
        if (mdFile === undefined || outputPath === undefined)
            return
        if (inputPath.endsWith('.md')) {
            const htmlOutput = marked(readFileSync(mdFile, 'utf8'))
            writeFileSync(outputPath, htmlOutput)
            return
        }
        const imageOutput = readFileSync(mdFile)
        writeFileSync(outputPath, imageOutput)
    })
}
