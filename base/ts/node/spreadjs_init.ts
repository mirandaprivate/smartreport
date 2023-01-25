import {name} from 'platform'

// tslint:disable:ordered-imports
import {init} from './mock_browser'

if (name === 'Node.js')
    init()

// tslint:disable-next-line: no-wildcard-import
import * as GC from '@grapecity/spread-sheets'
// tslint:disable-next-line: no-wildcard-import
import * as GCExcel from '@grapecity/spread-excelio'
// tslint:disable-next-line: no-import-side-effect
import '@grapecity/spread-sheets-charts'

import {WWW_LOGIOCEAN_KEY} from './spreadjs_license'

GC.Spread.Sheets.LicenseKey = WWW_LOGIOCEAN_KEY

setExcelKey(GCExcel)
function setExcelKey(obj: typeof GCExcel): void {
    // @ts-ignore
    obj.LicenseKey = WWW_LOGIOCEAN_KEY
}
