import Long from 'long'

import {
    encode32Bit,
    encode64Bit,
    encodeVarint32,
    encodeVarint64,
    stringToUtf8,
    zzEncode,
    zzEncodeLong,
} from './wire'

export function encodeString(str: string): readonly Uint8Array[] {
    const content = stringToUtf8(str)
    const length = encodeVarint32(content.byteLength)
    return [...length, content]
}

export function encodeBool(bool: boolean): readonly Uint8Array[] {
    const curr = bool ? 1 : 0
    return [new Uint8Array([curr])]
}

export function encodeBytes(value: Uint8Array): readonly Uint8Array[] {
    const length = encodeVarint32(value.byteLength)
    return [...length, value]
}

export function encodeFixed32(value: number): readonly Uint8Array[] {
    return encode32Bit(value)
}

export function encodeFloat(value: number): readonly Uint8Array[] {
    const float = new Float32Array([value])
    return [new Uint8Array(float.buffer)]
}

export function encodeSfixed32(value: number): readonly Uint8Array[] {
    return encode32Bit(value)
}

export function encodeFixed64(value: Readonly<Long>): readonly Uint8Array[] {
    return encode64Bit(value)
}

export function encodeSfixed64(value: Readonly<Long>): readonly Uint8Array[] {
    return encode64Bit(value)
}

export function encodeDouble(value: number): readonly Uint8Array[] {
    const double = new Float64Array([value])
    return [new Uint8Array(double.buffer)]
}

export function encodeInt32(value: number): readonly Uint8Array[] {
    return encodeVarint32(value)
}

export function encodeUint32(value: number): readonly Uint8Array[] {
    return encodeVarint32(value)
}

export function encodeSint32(value: number): readonly Uint8Array[] {
    const num = zzEncode(value)
    return encodeVarint32(num)
}

export function encodeInt64(value: Readonly<Long>): readonly Uint8Array[] {
    return encodeVarint64(value)
}

export function encodeUint64(value: Readonly<Long>): readonly Uint8Array[] {
    return encodeVarint64(value)
}

export function encodeSint64(value: Readonly<Long>): readonly Uint8Array[] {
    const num = zzEncodeLong(value)
    return encodeVarint64(num)
}

export function encodeEnum(value: number): readonly Uint8Array[] {
    return encodeVarint32(value)
}
