import {toByteArray} from 'base64-js'
import Long from 'long'

import {isLong, Message, toCamelCase, Value} from '../base'
import {
    EnumValueDescriptorProto,
    FieldDescriptorProto,
    Label,
    Type,
} from '../descriptor'
import {GLOBAL_REGISTRY} from '../registry'

import {isWkt, Wkt} from './wkt'

// tslint:disable-next-line: max-func-body-length
export function fromJson(content: string, pb: Message): Message {
    const mock = {...pb}
    const field = mock.protobufInternal.registry
        .getMessage(mock.protobufInternal.messageName)?.field
    if (field === undefined)
        return mock
    // tslint:disable-next-line: unknown-instead-of-any
    const raw = JSON.parse(content) as any
    // tslint:disable-next-line: max-func-body-length
    Reflect.ownKeys(raw).forEach((key: string | number | symbol): void => {
        let fd = field.find((
            f: FieldDescriptorProto,
        ): boolean => f.jsonName === key || f.name === key)
        if (fd === undefined)
            fd = field.find((f: FieldDescriptorProto): boolean =>
                toCamelCase(f.name) === key.toString())
        if (fd === undefined)
            return
        const attrName = toCamelCase(fd.name)
        let value = Reflect.get(raw, fd.jsonName)
        if (value === undefined)
            value = Reflect.get(raw, fd.name)
        /**
         * Parse single field.
         */
        if (fd.label !== Label.REPEATED) {
            if (fd.typeName === '.google.protobuf.Any') {
                parseAny(value, attrName, mock)
                return
            }
            Reflect.set(mock, attrName, parseValue(value, fd, mock))
            return
        }
        const anyObj = Reflect.get(mock, `_${attrName}_any`)
        /**
         * Parse repeated field.
         */
        if ((value instanceof Array)) {
            if (anyObj !== undefined) {
                parseArrayAny(value, attrName, mock)
                return
            }
            const values = value.map((
                v: Value | object,
            ): Value | object | Map<unknown, unknown> | undefined =>
                // tslint:disable-next-line: no-type-assertion
                parseValue(v, fd as FieldDescriptorProto, mock))
            Reflect.set(mock, attrName, values)
            return
        }
        /**
         * Parse map field.
         */
        const mapValue = parseValue(value, fd, mock)
        if (!(mapValue instanceof Map))
            return
        if (anyObj !== undefined) {
            parseMapAny(mapValue, attrName, mock)
            return
        }
        Reflect.set(mock, attrName, mapValue)
    })
    return mock
}

// tslint:disable-next-line: cyclomatic-complexity max-func-body-length
function parseValue(
    value: Value | object,
    fd: FieldDescriptorProto,
    mock: Message,
): Value | object | Map<unknown, Value> | undefined {
    switch (fd.type) {
    case Type.TYPE_INT64:
    case Type.TYPE_SINT64:
    case Type.TYPE_SFIXED64:
        return Long.fromValue(value.toString())
    case Type.TYPE_UINT64:
    case Type.TYPE_FIXED64:
        const long = Long.fromValue(value.toString())
        long.unsigned = true
        return long
    case Type.TYPE_BYTES:
        if (value instanceof Array)
            return new Uint8Array(value)
        // Decode base64 to Uint8Array.
        if (typeof value !== 'string')
            return value
        return toByteArray(value)
    case Type.TYPE_STRING:
        return String(value)
    case Type.TYPE_BOOL:
        return Boolean(value)
    case Type.TYPE_DOUBLE:
    case Type.TYPE_FIXED32:
    case Type.TYPE_FLOAT:
    case Type.TYPE_INT32:
    case Type.TYPE_SFIXED32:
    case Type.TYPE_SINT32:
    case Type.TYPE_UINT32:
        return Number(value)
    case Type.TYPE_ENUM:
        if (typeof value === 'number')
            return value
        // Decode string enum.
        const enumDesc = mock.protobufInternal.registry.getEnum(fd.typeName)
        if (enumDesc === undefined || typeof value !== 'string')
            return 0
        const item = enumDesc.value
            .find((enumValue: EnumValueDescriptorProto): boolean =>
               enumValue.name === value)
        if (item === undefined)
            return 0
        return item.number
    case Type.TYPE_MESSAGE:
        if (value === null)
            return
        const desc = mock.protobufInternal.registry.getMessage(fd.typeName)
        if (desc === undefined)
            return value
        if (!desc.options.mapEntry) {
            const constructor = mock.protobufInternal.registry
                .getConstructor(fd.typeName)
            if (constructor === undefined)
                return value
            const subMsg: Message = Reflect.construct(constructor, []).getImpl()
            if (isWkt(fd.typeName))
                return parseWkt(fd.typeName, value, subMsg)
            // tslint:disable-next-line: no-object
            Object.assign(subMsg, fromJson(JSON.stringify(value), subMsg))
            return subMsg
        }
        /**
         * Parse map field.
         */
        const mapKeyFd = desc.field.find(
            (f: FieldDescriptorProto): boolean => f.name === 'key',
        )
        const mapValueFd = desc.field.find(
            (f: FieldDescriptorProto): boolean => f.name === 'value',
        )
        if (mapKeyFd === undefined || mapValueFd === undefined)
            return value
        if (typeof value !== 'object')
            return value
        return new Map(Reflect.ownKeys(value).map((
            key: string | number | symbol,
        ): [string | number | Long, Value | object] => {
            const mapRawValue = Reflect.get(value, key)
            let mapKey = parseValue(key.toString(), mapKeyFd, mock)
            if (!(typeof mapKey === 'number' || typeof mapKey === 'string' ||
                isLong(mapKey)))
                mapKey = 0
            const mapValue = mapValueFd.typeName !== '.google.protobuf.Any'
                    ? parseValue(mapRawValue, mapValueFd, mock)
                    : mapRawValue
            return [mapKey, mapValue]
        }))
    default:
        return value
    }
}

// tslint:disable-next-line: max-func-body-length
function parseWkt(
    typeName: string,
    value: Value | object,
    wktMessage: Message,
): Message {
    switch (typeName) {
    case Wkt.DURATION:
        if (typeof value !== 'string')
            break
        const matchedDuration =
            value.match(/^([-+])?([0-9]+)(\.([0-9]{1,9}))?s$/)
        if (matchedDuration === null)
            break
        const signPos = 1
        const sign = matchedDuration[signPos] ?? ''
        const secondsPos = 2
        const durationSeconds = Long
            .fromString(`${sign}${matchedDuration[secondsPos]}`)
        const durationNanosPos = 4
        let durationNanosStr = matchedDuration[durationNanosPos] ?? ''
        const duraNanosPrecision = 9
        while (durationNanosStr.length < duraNanosPrecision)
            durationNanosStr += '0'
        const durationNanos =
            Number(`${sign}${durationNanosStr}`)
        Reflect.set(wktMessage, 'seconds', durationSeconds)
        Reflect.set(wktMessage, 'nanos', durationNanos)
        break
    case Wkt.TIMESTAMP:
        /**
         * See this [RFC 3339] regex at
         * (https://stackoverflow.com/questions/52806967/validate-rfc3339-date-
         * time-using-php).
         */
        if (typeof value !== 'string')
            break
        const matched = value.match(
            '^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt ]' +
            '([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.([0-9]+))?' +
            '(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))$',
        )
        if (matched === null)
            break
        /**
         * Magic number 1000: The precision of Date is millisecond, convert it
         * to second.
         */
        // tslint:disable-next-line: no-magic-numbers
        const timeStampSeconds = Math.floor(Date.parse(value) / 1000)
        const timeStampNanosPos = 8
        let timeStampNanosStr = matched[timeStampNanosPos]
        const tsNanosPrecision = 9
        while (timeStampNanosStr.length < tsNanosPrecision)
            timeStampNanosStr += '0'
        const timeStampNanos = Number(timeStampNanosStr)
        Reflect.set(wktMessage, 'seconds', Long.fromNumber(timeStampSeconds))
        Reflect.set(wktMessage, 'nanos', timeStampNanos)
        break
    default:
    }
    return wktMessage
}

/**
 * Parse single any field.
 */
function parseAny(value: object, attrName: string, mock: object): void {
    if (typeof value !== 'object')
        return
    const typeUrl = Reflect.get(value, '@type')
    if (typeof typeUrl !== 'string')
        return
    const msg = getMessageFromJson(typeUrl, value)
    if (msg === undefined)
        return
    const anyMsg = getGoogleAny(typeUrl, msg)
    if (anyMsg === undefined)
        return
    Reflect.set(mock, attrName, msg)
    Reflect.set(mock, `_${attrName}_any`, anyMsg)
}

/**
 * Parse repeated any field.
 */
function parseArrayAny(value: object, attrName: string, mock: object): void {
    if (!(value instanceof Array))
        return
    const msgArr: Message[] = []
    const anyArr: Message[] = []
    value.forEach((v: object): void => {
        if (typeof v !== 'object')
            return
        const typeUrl = Reflect.get(v, '@type')
        if (typeof typeUrl !== 'string')
            return
        const msg = getMessageFromJson(typeUrl, v)
        if (msg === undefined)
            return
        const anyMsg = getGoogleAny(typeUrl, msg)
        if (anyMsg === undefined)
            return
        msgArr.push(msg)
        anyArr.push(anyMsg)
    })
    Reflect.set(mock, attrName, msgArr)
    Reflect.set(mock, `_${attrName}_any`, anyArr)
}

/**
 * Parse any in map.
 */
function parseMapAny(
    value: Map<unknown, unknown>,
    attrName: string,
    mock: object,
): void {
    const msgMap = new Map()
    const anyMap = new Map()
    value.forEach((v: unknown, k: unknown): void => {
        if (typeof v !== 'object' || v === null)
            return
        const typeUrl = Reflect.get(v, '@type')
        if (typeof typeUrl !== 'string')
            return
        const msg = getMessageFromJson(typeUrl, v)
        if (msg === undefined)
            return
        const anyMsg = getGoogleAny(typeUrl, msg)
        if (anyMsg === undefined)
            return
        msgMap.set(k, msg)
        anyMap.set(k, anyMsg)
    })
    Reflect.set(mock, attrName, msgMap)
    Reflect.set(mock, `_${attrName}_any`, anyMap)
}

/**
 * Json format of any message is
 *  {
 *      '@type': [typeUrl],
 *      'foo': value1,
 *      'bar': value2,
 *      ...
 *  }
 * Specially, format of wkt type is
 *  {
 *      '@type': [typeUrl],
 *      'value': [wkt.toJson()],
 *  }
 */
function getMessageFromJson(typeUrl: string, value: object): Message | void {
    const fq = `.${typeUrl.slice(typeUrl.lastIndexOf('/') + 1)}`
    const ctor = GLOBAL_REGISTRY.getConstructor(fq)
    if (ctor === undefined)
        return
    const builder = Reflect.construct(ctor, [])
    if (isWkt(fq)) {
        const wktValue = Reflect.get(value, 'value')
        return parseWkt(fq, wktValue, builder.build())
    }
    Reflect.deleteProperty(value, '@type')
    return builder.fromJson(JSON.stringify(value)).build()
}

/**
 * Genrate google any according to typeUrl and encode binary.
 */
function getGoogleAny(typeUrl: string, msg: Message): Message | void {
    const anyCtor = GLOBAL_REGISTRY.getConstructor('.google.protobuf.Any')
    if (anyCtor === undefined)
        return
    const anyMsg: Message = Reflect.construct(anyCtor, []).getImpl()
    Reflect.set(anyMsg, 'typeUrl', typeUrl)
    const bin = Reflect.apply(Reflect.get(msg, 'encode'), msg, [])
    if (!(bin instanceof Uint8Array))
        return
    Reflect.set(anyMsg, 'value', bin)
    return anyMsg
}
