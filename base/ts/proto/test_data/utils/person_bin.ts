import {isException} from '../../common/exception'
import {writeFileSync} from 'fs'

import {buildPerson} from './person_build'

function genBin(): void {
    const person = buildPerson()
    const bin = person.encode()
    if (isException(bin))
        writeFileSync('actual.bin', new Uint8Array(0))
    writeFileSync('actual.bin', bin)
}

genBin()
