import {readFileSync} from 'fs'
import {join} from 'path'

import {
    ExtensionData,
    ExtensionDataBuilder,
    ExtensionDescriptor,
} from '../lib/extension'
import {buildPerson} from '../test_data/utils/person_build'
import {Person, PersonBuilder} from '../test_data/utils/person_mock'
import {E_AGE, E_NUMBER, E_TYPE} from '../test_data/utils/pet_mock'

/**
 * Testing `decode` requests an input binary stream and an empty `Person`
 * instance. Then compare this decoded instance with the expected result
 * generated by `../test_data/utils/person_build`. Here we have two input binary
 * stream for test. One is generated in Go getting it through `genrule` in
 * `BUILD`. And the other is generated by `encode` in `../encode/message.ts`
 * getting it through `genrule` in `BUILD`.
 */
// tslint:disable-next-line: max-func-body-length
describe('decode', (): void => {
    // generated by go
    let goBin: Uint8Array
    // generated by encode
    let tsBin: Uint8Array
    let expectPerson: Person
    const extDescriptor = [E_AGE, E_NUMBER, E_TYPE]
    beforeAll((): void => {
        const goBinFile = join(__dirname, './go.bin')
        const tsBinFile = join(__dirname, '../encode/ts.bin')
        goBin = readFileSync(goBinFile)
        tsBin = readFileSync(tsBinFile)
        expectPerson = buildPerson()
    })
    it('go-bin', (): void => {
        const person = new PersonBuilder().decode(goBin).build()
        decodeExtension(person)
        expect(person).toEqual(expectPerson)
    })
    it('ts-bin', (): void => {
        const person = new PersonBuilder().decode(tsBin).build()
        decodeExtension(person)
        expect(person).toEqual(expectPerson)
    })

    /**
     * Decode extension data and remove raw binary.
     */
    function decodeExtension(person: Person): void {
        expect(person.pet).toBeDefined()
        if (person.pet === undefined)
            return
        extDescriptor.forEach((des: ExtensionDescriptor): void => {
            if (person.pet === undefined)
                return
            const value = person.pet._ext.getExtension(des)
            expect(value).toBeDefined()
        })
        const extMap = person.pet._ext.extensionMap
        extMap.forEach((ext: ExtensionData, field: number): void => {
            extMap.set(field, new ExtensionDataBuilder()
                .descriptor(ext.descriptor)
                .value(ext.value)
                .build(),
            )
        })
    }
})
