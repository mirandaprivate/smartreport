// tslint:disable: no-magic-numbers
import Long from 'long'

import {
    encode32Bit,
    encode64Bit,
    encodeVarint32,
    encodeVarint64,
    zzEncode,
    zzEncodeLong,
} from './wire'

// tslint:disable-next-line:max-func-body-length
describe('encode wire', (): void => {
    it('zzEncode', (): void => {
        expect(zzEncode(-1)).toEqual(1)
        expect(zzEncode(0)).toEqual(0)
        expect(zzEncode(100)).toEqual(200)
        // max int32 0x7FFF FFFF
        expect(zzEncode(2147483647)).toEqual(4294967294)
        // min int32 0x8000 0000
        expect(zzEncode(-2147483648)).toEqual(4294967295)
    })
    it('zzEncodeLong', (): void => {
        expect(zzEncodeLong(Long.fromNumber(0)))
            .toEqual(Long.fromNumber(0, true))
        expect(zzEncodeLong(Long.fromNumber(-1)))
            .toEqual(Long.fromNumber(1, true))
        expect(zzEncodeLong(Long.fromNumber(1)))
            .toEqual(Long.fromNumber(2, true))
        // max int32 0x7FFF FFFF
        expect(zzEncodeLong(Long.fromNumber(2147483647)))
            .toEqual(Long.fromNumber(4294967294, true))
        // min int32 0x8000 0000
        expect(zzEncodeLong(Long.fromNumber(-2147483648)))
            .toEqual(Long.fromNumber(4294967295, true))
        expect(zzEncodeLong(Long.fromNumber(2147483648)))
            .toEqual(Long.fromNumber(4294967296, true))
        expect(zzEncodeLong(Long.fromNumber(-2147483649)))
            .toEqual(Long.fromNumber(4294967297, true))
        // max int64 0x7FFF FFFF FFFF FFFF
        expect(zzEncodeLong(new Long(-1, 2147483647)))
            .toEqual(new Long(-2, -1, true))
        // min int64 0x8000 0000 0000 0000
        expect(zzEncodeLong(new Long(0, -2147483648)))
            .toEqual(new Long(-1, -1, true))
    })
    it('encode32Bit', (): void => {
        const hex1 = buf2hex(encode32Bit(0))
        expect(hex1).toBe('00000000')
        const hex2 = buf2hex(encode32Bit(1))
        expect(hex2).toBe('01000000')
        const hex3 = buf2hex(encode32Bit(-1))
        expect(hex3).toBe('ffffffff')
        const hex4 = buf2hex(encode32Bit(50000))
        expect(hex4).toBe('50c30000')
    })
    it('encodeVarint32', (): void => {
        const hex1 = buf2hex(encodeVarint32(0))
        expect(hex1).toBe('00')
        const hex2 = buf2hex(encodeVarint32(1))
        expect(hex2).toBe('01')
        const hex3 = buf2hex(encodeVarint32(127))
        expect(hex3).toBe('7f')
        const hex4 = buf2hex(encodeVarint32(128))
        expect(hex4).toBe('8001')
        const hex5 = buf2hex(encodeVarint32(-1))
        expect(hex5).toBe('ffffffffffffffffff01')
    })
    it('encode64Bit', (): void => {
        const hex1 = buf2hex(encode64Bit(Long.fromNumber(0)))
        expect(hex1).toBe('0000000000000000')
        const hex2 = buf2hex(encode64Bit(Long.fromNumber(1)))
        expect(hex2).toBe('0100000000000000')
        const hex3 = buf2hex(encode64Bit(Long.fromNumber(-1)))
        expect(hex3).toBe('ffffffffffffffff')
        const hex5 = buf2hex(encode64Bit(Long.fromNumber(10000000)))
        expect(hex5).toBe('8096980000000000')
    })
    it('encodeVarint64', (): void => {
        const hex1 = buf2hex(encodeVarint64(Long.fromNumber(0)))
        expect(hex1).toBe('00')
        const hex2 = buf2hex(encodeVarint64(Long.fromNumber(1)))
        expect(hex2).toBe('01')
        const hex3 = buf2hex(encodeVarint64(Long.fromNumber(127)))
        expect(hex3).toBe('7f')
        const hex4 = buf2hex(encodeVarint64(Long.fromNumber(128)))
        expect(hex4).toBe('8001')
        const hex5 = buf2hex(encodeVarint64(Long.fromNumber(10000000)))
        expect(hex5).toBe('80ade204')
        const hex6 = buf2hex(encodeVarint64(Long.fromNumber(4294967295)))
        expect(hex6).toBe('ffffffff0f')
        const hex7 = buf2hex(encodeVarint64(Long.fromNumber(-1)))
        expect(hex7).toBe('ffffffffffffffffff01')
    })
})

function buf2hex(bufs: readonly Uint8Array[]): string {
    const buf = Buffer.concat([...bufs])
    const hex: string[] = []
    for (let i = 0; i < buf.byteLength; i += 1) {
        const part = buf[i].toString(16)
        const pad = '00' + part
        hex.push(pad.slice(-2))
    }
    return hex.join('')
}
