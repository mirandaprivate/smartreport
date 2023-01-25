import Long from 'long'

import {
    decodeBool,
    decodeDouble,
    decodeFixed32,
    decodeFixed64,
    decodeFloat,
    decodeInt32,
    decodeInt64,
    decodeSfixed32,
    decodeSfixed64,
    decodeSint32,
    decodeSint64,
    decodeString,
    decodeUint32,
} from './basic'
// tslint:disable: no-magic-numbers
// tslint:disable-next-line: max-func-body-length
describe('decode basic', (): void => {
    it('decodeBool', (): void => {
        const buf1 = new Uint8Array([0])
        expect(decodeBool(buf1)).toBe(false)
        const buf2 = new Uint8Array([1])
        expect(decodeBool(buf2)).toBe(true)
    })
    it('decodeFixed32', (): void => {
        const num1 = 5000
        const buf1 = new Uint8Array([0x88, 0x13, 0x00, 0x00])
        const result1 = decodeFixed32(buf1)
        expect(result1).toBe(num1)
    })
    it('decodeSfixed32', (): void => {
        const num1 = -31
        const buf1 = new Uint8Array([0xE1, 0xFF, 0xFF, 0xFF])
        const result1 = decodeSfixed32(buf1)
        expect(result1).toBe(num1)
    })
    it('decodeFloat', (): void => {
        const num1 = 5.3
        const buf1 = new Uint8Array([0x9A, 0x99, 0xA9, 0x40])
        const result1 = decodeFloat(buf1)
        expect(result1.toFixed(1)).toBe(num1.toFixed(1))
    })
    it('decodeFixed64', (): void => {
        const num1 = Long.fromNumber(5000, true)
        const buf1 = new Uint8Array([0x88, 0x13, 0, 0, 0, 0, 0, 0])
        const result1 = decodeFixed64(buf1)
        expect(result1).toEqual(num1)
    })
    it('decodeSfixed64', (): void => {
        const num1 = Long.fromNumber(-5000)
        const buf1 = new Uint8Array(
            [0x78, 0xEC, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
        )
        const result1 = decodeSfixed64(buf1)
        expect(result1).toEqual(num1)
    })
    it('decodeDouble', (): void => {
        const num1 = 3.1415926535
        const buf1 = new Uint8Array(
            [0x44, 0x17, 0x41, 0x54, 0xFB, 0x21, 0x09, 0x40],
        )
        const result1 = decodeDouble(buf1)
        expect(result1).toBe(num1)
    })
    it('decodeInt32', (): void => {
        const num1 = -1
        const buf1 = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x0F])
        const result1 = decodeInt32(buf1)
        expect(result1).toBe(num1)
        // Test compatibility.
        const num2 = -1
        const buf2 = new Uint8Array(
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
        )
        const result2 = decodeInt32(buf2)
        expect(result2).toEqual(num2)
    })
    it('decodeUInt32', (): void => {
        const num1 = 4294967295
        const buf1 = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x0F])
        const result1 = decodeUint32(buf1)
        expect(result1).toBe(num1)
        // Test compatibility.
        const num2 = 4294967295
        const buf2 = new Uint8Array(
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
        )
        const result2 = decodeUint32(buf2)
        expect(result2).toBe(num2)
    })
    it('decodeSint32', (): void => {
        const num1 = -255
        const buf1 = new Uint8Array([0xFD, 0x03])
        const result1 = decodeSint32(buf1)
        expect(result1).toBe(num1)
    })
    it('decodeInt64', (): void => {
        const num1 = Long.fromNumber(-1)
        const buf1 = new Uint8Array(
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01],
        )
        const result1 = decodeInt64(buf1)
        expect(result1).toEqual(num1)
        const num2 = Long.fromNumber(4294967297)
        const buf2 = new Uint8Array([0x81, 0x80, 0x80, 0x80, 0x10])
        const result2 = decodeInt64(buf2)
        expect(result2).toEqual(num2)
    })
    it('decodeUint64', (): void => {
        const num1 = Long.fromNumber(4294967297)
        const buf1 = new Uint8Array([0x81, 0x80, 0x80, 0x80, 0x10])
        const result1 = decodeInt64(buf1)
        expect(result1).toEqual(num1)
    })
    it('decodeSint64', (): void => {
        const num1 = Long.fromNumber(4294967296)
        const buf1 = new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x20])
        const result1 = decodeSint64(buf1)
        expect(result1).toEqual(num1)
    })
    it('decodeString', (): void => {
        const str1 = 'testing'
        const buf1 = new Uint8Array(
            [0x74, 0x65, 0x73, 0x74, 0x69, 0x6E, 0x67],
        )
        const result1 = decodeString(buf1)
        expect(result1).toBe(str1)
    })
})
