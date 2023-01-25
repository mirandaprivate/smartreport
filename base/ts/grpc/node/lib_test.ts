import {genData, parseData} from './lib'

describe('test lib', (): void => {
    it('test parseData', (): void => {
        // tslint:disable: no-magic-numbers
        const rawBin1 = Buffer.from([0, 0, 0, 0, 3, 1, 2, 3])
        const msgBin1 = parseData(rawBin1)
        const expectedBin1 = Buffer.from([1, 2, 3])
        expect(msgBin1).toEqual(expectedBin1)

        const rawBin2 = Buffer.from([0, 0, 0, 0, 4, 1, 2, 3])
        const msgBin2 = parseData(rawBin2)
        expect(msgBin2).toBeUndefined()
    })
    it('test genData', (): void => {
        const msgBin1 = Buffer.from([0, 1, 2, 3])
        const genBin1 = genData(msgBin1)
        const expectedBin1 = Buffer.from([0, 0, 0, 0, 4, 0 , 1, 2, 3])
        expect(genBin1).toEqual(expectedBin1)

        const msgBin2 = Buffer.from([])
        const genBin2 = genData(msgBin2)
        const expectedBin2 = Buffer.from([0, 0, 0, 0, 0])
        expect(genBin2).toEqual(expectedBin2)
    })
})
