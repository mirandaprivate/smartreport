import {fromByteArray} from 'base64-js'
import Long from 'long'

import {isLong, Message, toCamelCase, Value} from '../base'
import {
    EnumValueDescriptorProto,
    FieldDescriptorProto,
    Type,
} from '../descriptor'

import {isWkt, Wkt} from './wkt'

/**
 * Convert the message to json string.
 */
export function toJson(
    pb: Message,
    indent: string | number = '',
    ignoreDefault = true,
): string {
    const rename = {...pb}
    /**
     * Get typeUrl from google any and set it to `@type` field to the
     * corresponding message.
     */
    Reflect.ownKeys(rename).forEach((key: string | number | symbol): void => {
        const objAny = Reflect.get(rename, `_${key.toString()}_any`)
        if (typeof objAny !== 'object')
            return
        const obj = Reflect.get(rename, key)
        if (objAny instanceof Array) {
            const mocks = objAny.map((item: object, i: number): object => {
                const arrMock = {...obj[i]}
                const arrTypeUrl = Reflect.get(item, 'typeUrl')
                Reflect.set(arrMock, '@type', arrTypeUrl)
                return arrMock
            })
            Reflect.set(rename, key, mocks)
            return
        }
        if (objAny instanceof Map && obj instanceof Map) {
            const mockMap = new Map()
            objAny.forEach((v: object, k: string | number | Long): void => {
                const mapObj = obj.get(k)
                if (typeof mapObj !== 'object')
                    return
                const mapMock = {...mapObj}
                const mapTypeUrl = Reflect.get(v, 'typeUrl')
                Reflect.set(mapMock, '@type', mapTypeUrl)
                mockMap.set(k, mapMock)
            })
            Reflect.set(rename, key, mockMap)
            return
        }
        const typeUrl = Reflect.get(objAny, 'typeUrl')
        const mock = {...obj}
        Reflect.set(mock, '@type', typeUrl)
        Reflect.set(rename, key, mock)
    })
    /**
     * Rename field name to json name.
     */
    const descriptor = pb.protobufInternal.registry
        .getMessage(pb.protobufInternal.messageName)
    if (descriptor === undefined)
        return ''
    const jsonNameMap = new Map<string, string >(
        descriptor.field.map((f: FieldDescriptorProto): [string, string] =>
            [toCamelCase(f.name), f.jsonName]))
    Reflect.ownKeys(rename).forEach((key: string | number | symbol): void => {
        const jsonName = jsonNameMap.get(key.toString())
        if (jsonName === undefined) {
            /**
             * Remove all redundant field.
             */
            Reflect.deleteProperty(rename, key)
            return
        }
        if (jsonName === key)
            return
        Reflect.set(rename, jsonName, Reflect.get(rename, key))
        Reflect.deleteProperty(rename, key)
    })
    const jsonObj = {}
    Reflect.ownKeys(rename).forEach((key): void => {
        const oriValue = Reflect.get(rename, key)
        const jsonValue = getJsonValue(key.toString(), oriValue)
        if (jsonValue === undefined)
            return
        Reflect.set(jsonObj, key, jsonValue)
    })
    // tslint:disable-next-line: max-func-body-length cyclomatic-complexity
    function getJsonValue(k: string, v: Value): Value | object | undefined {
        if (descriptor === undefined)
            return
        const fd = descriptor.field.find((
            field: FieldDescriptorProto,
        ): boolean => field.jsonName === k)
        if (fd === undefined)
            return v
        if (ignoreDefault && shouldIgnore(v) && fd !== undefined &&
            fd.oneofIndex === undefined)
            return
        if (v instanceof Map) {
            const mapObj = {}
            const mapDesc = pb.protobufInternal.registry.getMessage(fd.typeName)
            if (mapDesc === undefined)
                return v
            const valueDesc = mapDesc.field
                .find((f: FieldDescriptorProto): boolean => f.name === 'value')
            if (valueDesc === undefined)
                return v
            v.forEach((mapV: Value, mapK: number | string): void => {
                const value = valueDesc.type === Type.TYPE_MESSAGE
                        && typeof mapV === 'object'
                        ? stringifyMessage(mapV, valueDesc, ignoreDefault)
                        : mapV
                Reflect.set(mapObj, mapK, value)
            })
            return mapObj
        }
        if (v instanceof Array)
            return v.map((item): Value | object => {
                if (fd.type !== Type.TYPE_MESSAGE)
                    return convertBaseValue(item, fd)
                return stringifyMessage(item, fd, ignoreDefault)
            })
        if (fd.type === Type.TYPE_MESSAGE && typeof v === 'object')
            return stringifyMessage(v, fd, ignoreDefault)
        return convertBaseValue(v, fd)
    }

    function convertBaseValue(v: Value, fd: FieldDescriptorProto): Value {
        if (isLong(v))
            return v.toString()
        if (v instanceof Uint8Array)
            return fromByteArray(v)
        if (fd.type === Type.TYPE_ENUM) {
            const enumDesc = pb.protobufInternal.registry.getEnum(fd.typeName)
            if (enumDesc === undefined)
                return v
            return enumDesc.value.find((
                ev: EnumValueDescriptorProto,
            ): boolean => ev.number === v)?.name ?? v
        }
        return v
    }
    return JSON.stringify(jsonObj, undefined, indent)
}

function stringifyMessage(
    value: object,
    fd: FieldDescriptorProto,
    ignoreDefault: boolean,
): object | string {
    if (isWkt(fd.typeName) && typeof value === 'object')
        return stringifyWtk(fd.typeName, value)
    /**
     * Call `toJson` of sub message to get renamed json string.
     */
    if (fd.type === Type.TYPE_MESSAGE && typeof value === 'object') {
        const subJson = Reflect.get(value, 'toJson')
        if (typeof subJson !== 'function')
            return value
        // tslint:disable-next-line: no-type-assertion
        return JSON
            .parse(Reflect.apply(subJson, value, ['', ignoreDefault])) as object
    }
    return value
}

// tslint:disable-next-line: max-func-body-length
function stringifyWtk(typeName: string, wktMessage: object): string | object {
    switch (typeName) {
    case Wkt.ANY:
        /**
         * See the format at
         * [https://github.com/protocolbuffers/protobuf/blob/master/src/google/
         * protobuf/any.proto#L94].
         * Usually, the json format of any field is the json content of the
         * decode message from the any binary with an additional field.
         *  {
         *      '@type': [typeUrl],
         *      'foo': value1,
         *      'bar': value2,
         *      ...
         *  }
         * Specially, when the type is a wkt type, the format is
         *  {
         *      '@type': [typeUrl],
         *      'value': [wkt.toJson()],
         *  }
         */
        // tslint:disable-next-line: no-type-assertion
        const msg = wktMessage as Message
        const typeUrl = Reflect.get(msg, '@type')
        const fq = `.${typeUrl.slice(typeUrl.lastIndexOf('/') + 1)}`
        if (!isWkt(fq)) {
            // tslint:disable-next-line: no-type-assertion
            const obj = JSON.parse(toJson(msg)) as object
            Reflect.set(obj, '@type', typeUrl)
            return obj
        }
        const value = stringifyWtk(fq, msg)
        return {
            '@type': typeUrl,
            value,
        }
    case Wkt.DURATION:
        const durationSeconds =
            Long.fromValue(Reflect.get(wktMessage, 'seconds'))
        const durationNanos = Number(Reflect.get(wktMessage, 'nanos'))
        return `${durationSeconds.toString()}.${Math.abs(durationNanos)}s`
    case Wkt.TIMESTAMP:
        const timeStampSeconds =
            Long.fromValue(Reflect.get(wktMessage, 'seconds'))
        const timeStampNanos = Number(Reflect.get(wktMessage, 'nanos'))
        const timeStampMillisecond =
            // tslint:disable-next-line: no-magic-numbers
            (timeStampSeconds.toNumber() + timeStampNanos / 1000000000) * 1000
        return new Date(timeStampMillisecond).toISOString()
    default:
        return ''
    }
}

function shouldIgnore(v: Value): boolean {
    if (v === 0)
        return true
    if (v === '')
        return true
    if (v instanceof Array && v.length === 0)
        return true
    if (typeof v === 'boolean' && !v)
        return true
    if (v instanceof Uint8Array && v.length === 0)
        return true
    if (isLong(v) && v.eq(0))
        return true
    if (v instanceof Map && v.size === 0)
        return true
    return false
}
