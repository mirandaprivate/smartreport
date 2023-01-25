import Long from 'long'

import {
    decode32Bit,
    decode64Bit,
    decodeVarint32,
    decodeVarint64,
    zzDecode,
    zzDecodeLong,
} from './wire'

// tslint:disable: no-magic-numbers
// tslint:disable-next-line:max-func-body-length
describe('encode wire', (): void => {
    it('zzDecode', (): void => {
        expect(zzDecode(0)).toEqual(0)
        expect(zzDecode(1)).toEqual(-1)
        expect(zzDecode(2)).toEqual(1)
        // max int32 0x7FFF FFFF
        expect(zzDecode(4294967294)).toEqual(2147483647)
        // min int32 0x8000 0000
        expect(zzDecode(4294967295)).toEqual(-2147483648)
    })
    it('zzDecodeLong', (): void => {
        const testData: readonly (readonly Long[])[] = [
            [zzDecodeLong(Long.fromNumber(0)), Long.fromNumber(0)],
            [zzDecodeLong(Long.fromNumber(1)), Long.fromNumber(-1)],
            [zzDecodeLong(Long.fromNumber(2)), Long.fromNumber(1)],
            [
                zzDecodeLong(Long.fromNumber(4294967294)),
                // max int32 0x7FFF FFFF
                Long.fromNumber(2147483647),
            ],
            [
                zzDecodeLong(Long.fromNumber(4294967295)),
                // min int32 0x8000 0000
                Long.fromNumber(-2147483648),
            ],
            [
                zzDecodeLong(Long.fromNumber(4294967296)),
                Long.fromNumber(2147483648),
            ],
            [
                zzDecodeLong(Long.fromNumber(4294967297)),
                Long.fromNumber(-2147483649),
            ],
            [
                // before zz 0xFFFF FFFF FFFF FFFE
                zzDecodeLong(new Long(-2, -1, true)),
                // max int64 0x7FFF FFFF FFFF FFFF
                new Long(-1, 2147483647),
            ],
            [
                // before zz 0xFFFF FFFF FFFF FFFF
                zzDecodeLong(new Long(-1, -1, true)),
                // min int64 0x8000 0000 0000 0000
                new Long(0, -2147483648),
            ],
        ]
        testData.forEach((value: readonly Long[]): void => {
            expect(value[0]).toEqual(value[1])
        })
    })
    it('decodeVarint32', (): void => {
        const testData: readonly (readonly number[])[] = [
            [decodeVarint32(new Uint8Array([0])), 0],
            [decodeVarint32(new Uint8Array([0x7F])), 127],
            [decodeVarint32(new Uint8Array([0x80, 0x01])), 128],
            [decodeVarint32(new Uint8Array([0xD0, 0x86, 0x03])), 50000],
            [
                decodeVarint32(new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0x0F])),
                -1,
            ],
        ]
        testData.forEach((value: readonly number[]): void => {
            expect(value[0]).toEqual(value[1])
        })
    })
    it('decodeVarint64', (): void => {
        const testData: readonly (readonly Long[])[] = [
            [decodeVarint64(new Uint8Array([0])), Long.fromNumber(0)],
            [decodeVarint64(new Uint8Array([0x7F])), Long.fromNumber(127)],
            [
                decodeVarint64(new Uint8Array([0x80, 0x01])),
                Long.fromNumber(128),
            ],
            [
                decodeVarint64(new Uint8Array([0xD0, 0x86, 0x03])),
                new Long(50000, 0),
            ],
            [
                decodeVarint64(
                    new Uint8Array([0x80, 0x90, 0xCA, 0xD2, 0xC6, 0x0E]),
                ),
                Long.fromNumber(500000000000),
            ],
            [
                decodeVarint64(new Uint8Array(
                    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                        0x01]),
                    ),
                // value = -1
                new Long(-1, -1),
            ],
        ]
        testData.forEach((value: readonly Long[]): void => {
            expect(value[0]).toEqual(value[1])
        })
    })
    it('decode32Bit', (): void => {
        const testData: readonly (readonly number[])[] = [
            [decode32Bit(new Uint8Array([0])), 0],
            [decode32Bit(new Uint8Array([0x01])), 1],
            [decode32Bit(new Uint8Array([0x50, 0xC3])), 50000],
            [decode32Bit(new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF])), -1],
        ]
        testData.forEach((value: readonly number[]): void => {
            expect(value[0]).toEqual(value[1])
        })
    })
    it('decode64Bit', (): void => {
        const testData: readonly (readonly Long[])[] = [
            [decode64Bit(new Uint8Array([0])), Long.fromNumber(0)],
            [decode64Bit(new Uint8Array([1])), Long.fromNumber(1)],
            [decode64Bit(new Uint8Array([0x50, 0xC3])), Long.fromNumber(50000)],
            [
                decode64Bit(new Uint8Array([0x00, 0x88, 0x52, 0x6A, 0x74])),
                Long.fromNumber(500000000000),
            ],
            [
                decode64Bit(new Uint8Array(
                        [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
                        ),
                    ),
                new Long(-1, -1),
            ],
        ]
        testData.forEach((value: readonly Long[]): void => {
            expect(value[0]).toEqual(value[1])
        })
    })
})
