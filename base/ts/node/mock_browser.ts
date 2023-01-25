// The ts-ignore is ok that we want to assign the mock window into global
// window, but the compiler can not infer that and if we want to use
// spread-sheet and spread-excelio, we need to import following npm packages
//      - FileReader    https://yarnpkg.com/en/package/filereader
//      - mock-browser  https://github.com/darrylwest/mock-browser
//      - bufferjs      https://github.com/solderjs/node-bufferjs
// These npm packages are out of update for about 3 years and there is no *.d.ts
// for these packages, so far we will not write *.d.ts files for these projects.

/**
 * Mock a browser for nodejs, call this function before using `window`.
 */
export function init(): void {
    // tslint:disable-next-line:no-require-imports no-var-requires
    const mockBrowser = require('mock-browser').mocks.MockBrowser
    // @ts-ignore
    global.window = mockBrowser.createWindow()
    // @ts-ignore
    global.document = window.document
    // @ts-ignore
    global.navigator = window.navigator
    // @ts-ignore
    global.HTMLCollection = window.HTMLCollection
    // @ts-ignore
    global.getComputedStyle = window.getComputedStyle

    // tslint:disable-next-line:ter-max-len
    // tslint:disable-next-line:no-require-imports no-var-requires mocha-no-side-effect-code
    const fileReader = require('FileReader')
    // @ts-ignore
    global.FileReader = fileReader
}
