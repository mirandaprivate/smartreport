import {uint8ArrayToStr} from '../../common/buffer'
import Long from 'long'

import {
    decode32Bit,
    decode64Bit,
    decodeVarint32,
    decodeVarint64,
    zzDecode,
    zzDecodeLong,
} from './wire'

/**
 * `>>> 0` makes a 32 bits number explained as unsigned int32.
 * ` | 0` makes a 32 bits number explained as signed int32.
 */
export function decodeString(bytes: Readonly<Uint8Array>): string {
    return uint8ArrayToStr(new Uint8Array(bytes))
}

export function decodeBytes(bytes: Readonly<Uint8Array>): Readonly<Uint8Array> {
    return new Uint8Array(bytes)
}

export function decodeBool(bytes: Readonly<Uint8Array>): boolean {
    return Boolean(bytes[0])
}

export function decodeFixed32(bytes: Readonly<Uint8Array>): number {
    return decode32Bit(bytes) >>> 0
}

export function decodeSfixed32(bytes: Readonly<Uint8Array>): number {
    return decode32Bit(bytes) | 0
}

export function decodeFloat(bytes: Readonly<Uint8Array>): number {
    const u8 = new Uint8Array(bytes)
    return new Float32Array(u8.buffer)[0]
}

export function decodeFixed64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    const long = Long.fromValue(decode64Bit(bytes))
    long.unsigned = true
    return long
}

export function decodeSfixed64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    return decode64Bit(bytes)
}

export function decodeDouble(bytes: Readonly<Uint8Array>): number {
    const u8 = new Uint8Array(bytes)
    return new Float64Array(u8.buffer)[0]
}

export function decodeInt32(bytes: Readonly<Uint8Array>): number {
    return decodeVarint32(bytes) | 0
}

export function decodeUint32(bytes: Readonly<Uint8Array>): number {
    return decodeVarint32(bytes) >>> 0
}

export function decodeSint32(bytes: Readonly<Uint8Array>): number {
    return zzDecode(decodeVarint32(bytes)) | 0
}

export function decodeInt64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    return decodeVarint64(bytes)
}

export function decodeUint64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    const long = Long.fromValue(decodeVarint64(bytes))
    long.unsigned = true
    return long
}

export function decodeSint64(bytes: Readonly<Uint8Array>): Readonly<Long> {
    const long = decodeVarint64(bytes)
    return zzDecodeLong(long)
}

export function decodeEnum(bytes: Readonly<Uint8Array>): number {
    return decodeVarint32(bytes) | 0
}
