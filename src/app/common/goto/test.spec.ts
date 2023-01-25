import {GotoComponent} from './component'

describe('goto component test: ', () => {
    it('disabled test', () => {
        const com1 = new GotoComponent()
        com1.total = 1
        expect(com1.prevDisabled).toBe(true)
        expect(com1.nextDisabled).toBe(true)

        const com2 = new GotoComponent()
        com2.total = 2
        expect(com2.prevDisabled).toBe(true)
        expect(com2.nextDisabled).toBe(false)
        com2.onClickNext()
        expect(com2.prevDisabled).toBe(false)
        expect(com2.nextDisabled).toBe(true)

        const com3 = new GotoComponent()
        com3.total = 0
        // tslint:disable-next-line: no-lifecycle-call
        expect(() => {com3.ngOnInit()}).toThrowError()
    })
})
