import {name} from 'platform'

describe('Foo test.', (): void => {
    it('web test.', (): void => {
        expect(name).toBe('Node.js')
    })
})
