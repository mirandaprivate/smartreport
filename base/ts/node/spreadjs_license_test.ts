/**
 * Have to import the libraries in the following order.
 *
 * `@grapecity/spread-sheets` needs to access a few global variables that are
 * normally only available from within a browser environment, e.g., `window`.
 * The `init()` function mocks those variables. As a result, `init()` must be
 * executed before `@grapecity/spread-sheets` is imported.
 */
// tslint:disable:ordered-imports

import {init} from './mock_browser'

init()

import * as GC from '@grapecity/spread-sheets'
import {WWW_LOGIOCEAN_KEY} from './spreadjs_license'

describe('read json test', () => {
    it('test.json', () => {
        GC.Spread.Sheets.LicenseKey = WWW_LOGIOCEAN_KEY
        const book = new GC.Spread.Sheets.Workbook()
        const sheet = new GC.Spread.Sheets.Worksheet('mysheet')
        book.addSheet(0, sheet)
        expect(book.sheets[0].name()).toBe('mysheet')
    })
})
