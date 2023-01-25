import {strToUint8Array} from '../../common/buffer'
import Long from 'long'

const B127 = 0x7F
const B128 = 0x80

export function zzEncodeLong(long: Readonly<Long>): Readonly<Long> {
    const result = Long.fromValue(long)
    // tslint:disable-next-line: no-magic-numbers
    const mask = result.high >> 31
    // magic number 31: Set the highest bit to the lowest bit.
    // tslint:disable-next-line: no-magic-numbers no-object-mutation
    result.high = (result.high << 1 | result.low >>> 31) ^ mask
    // tslint:disable-next-line: no-object-mutation
    result.low = (result.low << 1) ^ mask
    // tslint:disable-next-line: no-object-mutation
    result.unsigned = true
    return result
}

export function zzEncode(value: number): number {
    // tslint:disable-next-line: no-magic-numbers
    return ((value << 1) ^ (value >> 31)) >>> 0
}

export function encodeVarint32(value: number): readonly Uint8Array[] {
    const long = Long.fromNumber(value)
    return encodeVarint64(long)
}

export function encodeVarint64(value: Readonly<Long>): readonly Uint8Array[] {
    let high = value.high >>> 0
    let low = value.low >>> 0
    const bufs: Uint8Array[] = []
    // tslint:disable-next-line: no-loop-statement
    while (high) {
        const buf1 = new Uint8Array(1)
        // tslint:disable-next-line: no-object-mutation
        buf1[0] = low & B127 | B128
        bufs.push(buf1)
        /**
         * magic number 25: Left shift 25 bits to set lowest 7 bits to highest 7
         * bits of a 32 bits number.
         */
        // tslint:disable-next-line: no-magic-numbers
        low = (low >>> 7 | high << 25) >>> 0
        // tslint:disable-next-line: no-magic-numbers
        high >>>= 7
    }
    // tslint:disable-next-line: no-loop-statement
    while (low > B127) {
        const buf2 = new Uint8Array(1)
        // tslint:disable-next-line: no-object-mutation
        buf2[0] = low & B127 | B128
        bufs.push(buf2)
        // tslint:disable-next-line: no-magic-numbers
        low = low >>> 7
    }
    const buf = new Uint8Array(1)
    // tslint:disable-next-line: no-object-mutation
    buf[0] = low
    bufs.push(buf)
    return bufs
}

export function stringToUtf8(s: string): Uint8Array {
    return strToUint8Array(s)
}

export function encode32Bit(value: number): readonly Uint8Array[] {
    const u32 = new Uint32Array(1)
    // tslint:disable-next-line: no-object-mutation
    u32[0] = value >>> 0
    return [new Uint8Array(u32.buffer)]
}

export function encode64Bit(value: Readonly<Long>): readonly Uint8Array[] {
    const buf1 = encode32Bit(value.low)
    const buf2 = encode32Bit(value.high)
    return [...buf1, ...buf2]
}
