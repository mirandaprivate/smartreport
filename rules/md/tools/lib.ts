import {highlightAuto} from 'highlight.js'

/**
 * Transforms a given code block into its corresponding HTML output. We do this
 * using highlight.js because it allows us to show colored code blocks in our
 * documentation.
 */
export function highlightCodeBlock(code: string): string {
    return highlightAuto(code).value
}
