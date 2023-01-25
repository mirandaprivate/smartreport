import {Code, CodeTab} from './code_tab'
import {MENU_SAMPLE_A} from './menu'

export {Code, CodeTab}

// tslint:disable-next-line: no-indexable-types readonly-keyword
export const SAMPLE_CODES: {[key: string]: readonly CodeTab[]} = {
    menu_a: MENU_SAMPLE_A,
}
