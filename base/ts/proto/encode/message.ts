// tslint:disable: no-type-assertion
import {concat} from '../../common/buffer'
import {
    Exception,
    ExceptionBuilder,
    isException,
} from '../../common/exception'

import {
    getWireType,
    MapEntry,
    MapEntryBuilder,
    Message,
    toCamelCase,
    Value,
    WireType,
} from '../lib/base'
import {
    DescriptorProto,
    FieldDescriptorProto,
    Label,
    Type,
} from '../lib/descriptor'
import {ExtensionData, isExtension} from '../lib/extension'
import {Registry} from '../lib/registry'

import {
    encodeBool,
    encodeBytes,
    encodeDouble,
    encodeEnum,
    encodeFixed32,
    encodeFixed64,
    encodeFloat,
    encodeInt32,
    encodeInt64,
    encodeSfixed32,
    encodeSfixed64,
    encodeSint32,
    encodeSint64,
    encodeString,
    encodeUint32,
    encodeUint64,
} from './basic'

/**
 * Encode a protobuf message into a binary stream.
 */
export function encode(obj: Readonly<Message>): Uint8Array | Exception {
    const registry = obj.protobufInternal.registry
    if (registry === undefined)
        return new ExceptionBuilder().message('Missing registry.').build()
    const messageName = obj.protobufInternal.messageName
    const descriptor = registry.getMessage(messageName)
    if (descriptor === undefined)
        return new ExceptionBuilder()
            .message(`Failed to look for the descriptor by ${messageName}.`)
            .build()
    return encodeInternal(descriptor, obj)
}

function encodeInternal(
    descriptor: Readonly<DescriptorProto>,
    obj: Readonly<Message>,
): Uint8Array {
    const bufs: Uint8Array[] = []
    const fields = descriptor.field
    const registry = obj.protobufInternal.registry
    // tslint:disable-next-line: max-func-body-length
    fields.forEach((field: Readonly<FieldDescriptorProto>): void => {
        const attrName = toCamelCase(field.name)
        const value = Reflect.get(obj, attrName)
        /**
         * Ignore undefined value.
         */
        if (value === undefined)
            return
        /**
         * Ignore defalut value unless it is a oneof field or map field.
         */
        if (field.oneofIndex === undefined && !descriptor.options.mapEntry &&
            (value === null || value === 0 || value === ''))
            return
        /**
         * Encode singular value.
         */
        if (field.label !== Label.REPEATED) {
            const buf1 = encodeKeyValue(field, value, registry)
            if (isException(buf1))
                return
            const result = buf1
            result.forEach(r => bufs.push(r))
            return
        }
        /**
         * Encode repeated value.
         */
        if (value instanceof Array) {
            /**
             * Encode array type.
             */
            /**
             * The `value` is certain to be a `Value[]` type because of the
             * judgement `value instanceof Array` above.
             */
            const values = value as Value[]
            const buf2 = encodeRepeated(field, values, registry)
            buf2.forEach(b => bufs.push(b))
            return
        }
        if (!(value instanceof Map))
            return
        /**
         * Convert the map to a MapEntry to encode.
         */
        /**
         * The `value` is certain to be a `Map<string | number, Value>` type
         * because of the judgement `value instanceof Map` above.
         */
        const map = value as Map<string | number, Value>
        const mapEntries: MapEntry[] = []
        map.forEach((v: Value, k: string | number): void => {
            mapEntries.push(new MapEntryBuilder()
                .key(k)
                .value(v)
                .protobufInternal({
                    fileDescriptorProto:
                        obj.protobufInternal.fileDescriptorProto,
                    messageName: field.typeName,
                    registry: obj.protobufInternal.registry,
                })
                .build())
        })
        const buf3 = encodeRepeated(field, mapEntries, registry)
        buf3.forEach(b => bufs.push(b))
    })
    encodeExtension(obj).forEach(b => bufs.push(b))
    return concat(bufs)
}

function encodeKeyValue(
    fd: Readonly<FieldDescriptorProto>,
    value: Readonly<Value>,
    registry: Readonly<Registry>,
): readonly Uint8Array[] | Exception {
    const type = fd.type
    const fieldNum = fd.number
    const key = encodeKey(fieldNum, type)
    const buf = encodeValue(type, value, registry)
    if (isException(buf))
        return buf
    const valueByte = buf
    return [...key, ...valueByte]
}

// tslint:disable-next-line: max-func-body-length cyclomatic-complexity
function encodeValue(
    type: Readonly<Type>,
    value: Readonly<Value>,
    registry: Readonly<Registry>,
): readonly Uint8Array[] | Exception {
    switch (type) {
    case Type.TYPE_MESSAGE :
        const subMessage = value as Message
        const name = subMessage.protobufInternal.messageName
        const descriptor = registry.getMessage(name)
        if (descriptor === undefined)
            return [new Uint8Array(0)]
        let buf!: Uint8Array
        if (descriptor.options.mapEntry)
            buf = encodeInternal(descriptor, subMessage)
        else {
            const res = subMessage.encode()
            if (isException(res))
                return res
            buf = res as Uint8Array
        }
        const len = encodeInt32(buf.byteLength)
        return [...len, buf]
    case Type.TYPE_ENUM:
        return encodeEnum(value as number)
    case Type.TYPE_BOOL:
        return encodeBool(value as boolean)
    case Type.TYPE_DOUBLE:
        return encodeDouble(value as number)
    case Type.TYPE_STRING:
        return encodeString(value as string)
    case Type.TYPE_FLOAT:
        return encodeFloat(value as number)
    case Type.TYPE_INT32:
        return encodeInt32(value as number)
    case Type.TYPE_SINT32:
        return encodeSint32(value as number)
    case Type.TYPE_INT64:
        return encodeInt64(value as Long)
    case Type.TYPE_SINT64:
        return encodeSint64(value as Long)
    case Type.TYPE_UINT64:
        return encodeUint64(value as Long)
    case Type.TYPE_UINT32:
        return encodeUint32(value as number)
    case Type.TYPE_SFIXED32:
        return encodeSfixed32(value as number)
    case Type.TYPE_SFIXED64:
        return encodeSfixed64(value as Long)
    case Type.TYPE_FIXED32:
        return encodeFixed32(value as number)
    case Type.TYPE_FIXED64:
        return encodeFixed64(value as Long)
    case Type.TYPE_BYTES:
        return encodeBytes(value as Uint8Array)
    default:
        return new ExceptionBuilder()
            .message(`Type ${type} is not implemented.`)
            .build()
    }
}

function encodeKey(field: number, type: Readonly<Type>): readonly Uint8Array[] {
    const wire = getWireType(type) as number
    const wireLen = 3
    /**
     * Field number is between 1 ~ 2^29-1 so it is safe to left shift 3 bit.
     */
    const key = field << wireLen | wire
    return encodeUint32(key)
}

function encodeRepeated(
    fd: Readonly<FieldDescriptorProto>,
    values: readonly Readonly<Value>[],
    registry: Readonly<Registry>,
): readonly Uint8Array[] {
    const buf: Uint8Array[] = []
    const type = fd.type
    const wireType = getWireType(type)
    const fieldNum = fd.number
    /**
     * Encode unpacked values.
     */
    if (!(wireType !== WireType.LENGTH_DELI && fd.options.packed)) {
        values.forEach((v: Readonly<Value>): void => {
            const buf1 = encodeKeyValue(fd, v, registry)
            if (isException(buf1))
                return
            const result = buf1
            result.forEach(b => buf.push(b))
        })
        return buf
    }
    /**
     * Encode packed values.
     */
    values.forEach((v: Readonly<Value>): void => {
        const buf1 = encodeValue(type, v, registry)
        if (isException(buf1))
            return
        const result = buf1
        result.forEach(b => buf.push(b))
    })
    const valueBuf = concat(buf)
    if (valueBuf.length <= 0)
        return [new Uint8Array(0)]
    /**
     * Use TYPE_STRING to represent repeated packed type to get wire value 2.
     */
    const key = encodeKey(fieldNum, Type.TYPE_STRING)
    const len = encodeUint32(valueBuf.byteLength)
    return [...key, ...len, valueBuf]
}

function encodeExtension(obj: Readonly<Message>): readonly Uint8Array[] {
    const extData = Reflect.get(obj, '_ext')
    if (!isExtension(extData))
        return [new Uint8Array(0)]
    const bufs: Uint8Array[] = []
    extData.extensionMap.forEach((ext: ExtensionData): void => {
        if (ext.raw.length !== 0) {
            bufs.push(ext.raw as Uint8Array)
            return
        }
        const desc = ext.descriptor
        let registry!: Readonly<Registry>
        if (desc.fieldDescriptor.type === Type.TYPE_MESSAGE) {
            if (desc.registry === undefined)
                return
            registry = desc.registry
        } else
            registry = new Registry()
        if (ext.value instanceof Array) {
            const buf1 = encodeRepeated(
                desc.fieldDescriptor,
                ext.value as Value[],
                registry,
            )
            buf1.forEach(b => bufs.push(b))
            return
        }
        const buf2 = encodeKeyValue(
            desc.fieldDescriptor,
            ext.value as Value,
            registry,
        )
        if (isException(buf2))
            return
        buf2.forEach(b => bufs.push(b))
    })
    return bufs
}
