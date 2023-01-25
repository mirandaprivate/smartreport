import Long from 'long'

import {
    encodeBool,
    encodeBytes,
    encodeDouble,
    encodeFixed32,
    encodeFloat,
    encodeInt32,
    encodeInt64,
    encodeSfixed32,
    encodeSfixed64,
    encodeSint32,
    encodeSint64,
    encodeString,
    encodeUint32,
} from './basic'

// tslint:disable-next-line:max-func-body-length
describe('encode basic', (): void => {
    it('encodeBool', (): void => {
        const bool1 = true
        const result1 = encodeBool(bool1)
        expect(buf2hex(result1)).toBe('01')
        const bool2 = false
        const result2 = encodeBool(bool2)
        expect(buf2hex(result2)).toBe('00')
    })
    it('encodeInt32', (): void => {
        const num1 = -1
        const result1 = encodeInt32(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('ffffffffffffffffff01')
        const num2 = 128
        const result2 = encodeInt32(num2)
        const hex2 = buf2hex(result2)
        expect(hex2).toBe('8001')
    })
    it('encodeBytes', (): void => {
        const bytes = encodeInt32(-1)
        const result1 = encodeBytes(Buffer.concat([...bytes]))
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('0affffffffffffffffff01')
    })
    it('encodeUint32', (): void => {
        const num1 = 4294967295
        const result1 = encodeUint32(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('ffffffff0f')
    })
    it('encodeSint32', (): void => {
        const num1 = -255
        const result1 = encodeSint32(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('fd03')
    })
    it('encodeInt64', (): void => {
        const num1 = -1
        const result1 = encodeInt64(Long.fromNumber(num1))
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('ffffffffffffffffff01')
        const num2 = 4294967297
        const result2 = encodeInt64(Long.fromNumber(num2))
        const hex2 = buf2hex(result2)
        expect(hex2).toBe('8180808010')
    })
    it('encodeSint64', (): void => {
        const num1 = 4294967296
        const result1 = encodeSint64(Long.fromNumber(num1))
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('8080808020')
    })
    it('encodeFloat', (): void => {
        const num1 = 5.3
        const result1 = encodeFloat(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('9a99a940')
    })
    it('encodeDouble', (): void => {
        const double1 = 2.25
        const result1 = encodeDouble(double1)
        expect(buf2hex(result1)).toBe('0000000000000240')
    })
    it('encodeFixed32', (): void => {
        const num1 = 5000
        const result1 = encodeFixed32(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('88130000')
    })
    it('encodeSfixed32', (): void => {
        const num1 = -31
        const result1 = encodeSfixed32(num1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('e1ffffff')
    })
    it('encodeSfixed64', (): void => {
        const num1 = -5000
        const result1 = encodeSfixed64(Long.fromNumber(num1))
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('78ecffffffffffff')
    })
    it('encodeString', (): void => {
        const str1 = 'testing'
        const result1 = encodeString(str1)
        const hex1 = buf2hex(result1)
        expect(hex1).toBe('0774657374696e67')
    })
})

function buf2hex(bufs: readonly Uint8Array[]): string {
    const buf = Buffer.concat([...bufs])
    const hex: string[] = []
    for (let i = 0; i < buf.byteLength; i += 1) {
        // tslint:disable-next-line: no-magic-numbers
        const part = buf[i].toString(16)
        const pad = '00' + part
        // tslint:disable-next-line: no-magic-numbers
        hex.push(pad.slice(-2))
    }
    return hex.join('')
}
