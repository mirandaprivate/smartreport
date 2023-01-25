import {Builder} from '../../common/builder'
import {Exception} from '../../common/exception'
import Long from 'long'

import {FileDescriptorProto, Type} from './descriptor'
import {Registry} from './registry'

/**
 * All types of value supported in typescript.
 */
export type Value = number | boolean | string | Long | Uint8Array | Message

/**
 * The necessary information of a message provided by plugin helping
 * encode/decode.
 */
export interface Message {
    readonly protobufInternal: Readonly<ProtobufInternal>
    encode(): Readonly<Uint8Array> | Exception
    toJson(indent?: string | number, ignoreDefault?: boolean): string
    clone(): Message
}

export interface ProtobufInternal {
    readonly messageName: string
    readonly fileDescriptorProto: Readonly<FileDescriptorProto>
    readonly registry: Readonly<Registry>
}

/**
 * WireType provides just enough information to find the length.
 * For more: https://developers.google.com/protocol-buffers/docs/encoding
 */
export const enum WireType {
    /**
     * int32, int64, uint32, sint32, bool, enum
     */
    VARINT = 0x00,
    /**
     * fixed64, sfixed64, double
     */
    FIXED64 = 0x01,
    /**
     * string, bytes, embedded messages, packed repeated fields
     */
    LENGTH_DELI = 0x02,
    /**
     * deprecated
     */
    START_GROUP = 0x03,
    /**
     * deprecated
     */
    END_GROUP = 0x04,
    /**
     * fixed32, sfixed32, float
     */
    FIXED32 = 0x05,
}

// Convert Type to WireType.
export function getWireType(type: Readonly<Type>): Readonly<WireType> {
    let result!: WireType
    WIRE_TYPE_MAP.forEach((
        v: Readonly<Set<Type>>,
        key: Readonly<WireType>,
    ): void => {
        if (!v.has(type))
            return
        result = key
    })
    if (result === undefined)
        return WireType.VARINT
    return result
}

// WireType to Type.
const WIRE_TYPE_MAP = new Map <Readonly<WireType>, Readonly<Set<Type>>>([
    [WireType.VARINT, new Set<Type>([
        Type.TYPE_INT32,
        Type.TYPE_INT64,
        Type.TYPE_UINT32,
        Type.TYPE_UINT64,
        Type.TYPE_SINT32,
        Type.TYPE_SINT64,
        Type.TYPE_BOOL,
        Type.TYPE_ENUM,
    ])],
    [WireType.FIXED64, new Set<Type>([
        Type.TYPE_FIXED64,
        Type.TYPE_SFIXED64,
        Type.TYPE_DOUBLE,
    ])],
    [WireType.LENGTH_DELI, new Set<Type>([
        Type.TYPE_STRING,
        Type.TYPE_BYTES,
        Type.TYPE_MESSAGE,
    ])],
    [WireType.FIXED32, new Set<Type>([
        Type.TYPE_FIXED32,
        Type.TYPE_SFIXED32,
        Type.TYPE_FLOAT,
    ])],
])

/**
 * MapEntry is a Message type for converting Map.
 */
export interface MapEntry extends Message {
    readonly key: number | string
    readonly value: Value
}

class MapEntryImpl implements MapEntry {
    /**
     * Key and value is certain to be set before use during encode/decode.
     */
    public key!: number | string
    public value!: Value
    /**
     * MessageName is certain to be set before use during encode/decode.
     * FileDescriptorProto is actually never be used in MapEntry.
     */
    public protobufInternal!: Readonly<ProtobufInternal>
    // tslint:disable-next-line: prefer-function-over-method
    public encode(): Uint8Array | Exception {
        return new Uint8Array(0)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public toJson(): string {
        return ''
    }

    public clone(): Message {
        return this
    }
}

/**
 * A builder to build MapEntry.
 */
export class MapEntryBuilder extends Builder<MapEntry, MapEntryImpl> {
    public constructor(obj?: Readonly<MapEntry>) {
        const impl = new MapEntryImpl()
        if (obj)
            MapEntryBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public key(value: number | string): this {
        this.getImpl().key = value
        return this
    }

    public value(value: Value): this {
        this.getImpl().value = value
        return this
    }

    public protobufInternal(value: ProtobufInternal): this {
        this.getImpl().protobufInternal = value
        return this
    }
}

const CAMLE_CASE_MAP = new Map<string, string>()

/**
 * 将message中的field name转换成typescript中实际使用的变量名.
 * 这个函数的结果需要与ts proto plugin中的LowerCamelCase方法保持一致,
 * 即https://github.com/lyft/protoc-gen-star/blob/master/name.go中的
 * LowerCamelCase方法.
 */
export function toCamelCase(snakeCase: string): string {
    const cache = CAMLE_CASE_MAP.get(snakeCase)
    if (cache !== undefined)
        return cache

    const oriParts = split(snakeCase)
    const parts: string[] = []
    for (let i = 0; i < oriParts.length; i += 1) {
        const p = oriParts[i]
        if (i === 0)
            parts.push(p.toLowerCase())
        else
            parts.push(toTitle(p))
    }
    const camelCase = parts.join('')
    const maxMapLen = 2000
    if (CAMLE_CASE_MAP.size > maxMapLen)
        CAMLE_CASE_MAP.clear()
    CAMLE_CASE_MAP.set(snakeCase, camelCase)
    return camelCase
}

// tslint:disable-next-line: cyclomatic-complexity
function split(str: string): readonly string[] {
    if (str === '')
        return []
    if (str.lastIndexOf('_') > 0) {
        const parts = str.split('_')
        if (parts[0] !== '')
            return parts
        return ['_' + parts[1], ...parts.slice(2)]
    }
    const res: string[] = []
    let part = ''
    let capt = false
    let num = false
    const lodash = str[0] === '_'
    for (const r of str) {
        const uc = isUpper(r)
        const dg = isDigit(r)
        if (uc && !capt && part.length > 0 && !lodash) {
            res.push(part)
            part = ''
        } else if (dg && !num && part.length > 0 && !lodash) {
            res.push(part)
            part = ''
        } else if (!uc && capt && part.length > 1) {
            if (part.length > 1 && (part.length !== 2 || part[0] !== '_')) {
                const last = part[part.length - 1]
                res.push(part.slice(0, part.length - 1))
                part = last
            }
        } else if (!dg && num && part.length >= 1) {
            res.push(part)
            part = ''
        }
        num = dg
        capt = uc
        part = part + r
    }
    res.push(part)
    return res
}

function isUpper(c: string): boolean {
    return c >= 'A' && c <= 'Z'
}

function isDigit(c: string): boolean {
    return c >= '0' && c <= '9'
}

function toTitle(str: string): string {
    if (str.length === 0)
        return str
    return str[0].toUpperCase() + str.slice(1)
}

export function isLong(obj: unknown): obj is Long {
    return Long.isLong(obj)
}
