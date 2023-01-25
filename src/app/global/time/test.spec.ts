// tslint:disable-next-line: no-wildcard-import
import * as Long from 'long'

import {FormatTime} from './pipe'

describe('none dom time pipe test', () => {
    it('' , () => {
        const pipe = new FormatTime()
        const date = new Long(1602579827)
        expect(pipe.transform(undefined)).toBe('-')
        expect(pipe.transform(null)).toBe('-')
        expect(pipe.transform(date)).toBe('2020-10-13 09:03:47')
    })
})
