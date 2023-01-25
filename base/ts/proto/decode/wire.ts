import Long from 'long'

const B127 = 0x7F

export function zzDecode(value: number): number {
    const mask = -(value & 1)
    const decoded = ((value >>> 1) ^ mask) >>> 0
    const u32 = new Uint32Array([decoded])
    const u8 = new Uint8Array(u32.buffer)
    return new DataView(u8.reverse().buffer).getInt32(0)
}

export function zzDecodeLong(value: Readonly<Long>): Readonly<Long> {
    const long = Long.fromValue(value)
    const mask = -(long.low & 1)
    // magic number 31: Shift the lowest bit to highest bit of a 32bits number.
    // tslint:disable-next-line: no-magic-numbers no-object-mutation
    long.low = ((long.low >>> 1) | (long.high << 31)) ^ mask
    long.high = (long.high >>> 1) ^ mask
    long.unsigned = false
    return long
}

export function decodeVarint32(bytes: Readonly<Uint8Array>): number {
    return bytes.reduceRight(
        (prev: number, curr: number): number =>
        // tslint:disable-next-line: no-magic-numbers
        (prev << 7) | (curr & B127),
        0,
    )
}

export function decodeVarint64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    return bytes.reduceRight(
        (prev: Long, curr: number): Long => {
        /**
         * magic number 25: Move highest 7 effective bits to lowest 7 bits of a
         * 32bits number.
         */
        // tslint:disable-next-line: no-magic-numbers no-object-mutation
            prev.high = ((prev.high << 7) | (prev.low >>> 25))
        // tslint:disable-next-line: no-magic-numbers no-object-mutation
            prev.low = ((prev.low << 7) >>> 0) | (curr & B127)
            return prev
        },
        new Long(0, 0),
    )
}

export function decode32Bit(bytes: Readonly<Uint8Array>): number {
    return bytes.reduceRight(
        (prev: number, curr: number): number =>
        // magic number 8: A byte contains 8 bits.
        // tslint:disable-next-line: no-magic-numbers
        (prev << 8) | curr,
        0,
    )
}

export function decode64Bit(bytes: Readonly<Uint8Array>): Readonly<Long> {
    const result = new Long(0, 0)
    const byteLen = 4
    result.low = decode32Bit(bytes.slice(0, byteLen))
    result.high = decode32Bit(bytes.slice(byteLen))
    return result
}
