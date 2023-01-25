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
import {
    ExtensionDataBuilder,
    ExtensionRange,
    isExtension,
} from '../lib/extension'
import {Registry} from '../lib/registry'

import {
    decodeBool,
    decodeBytes,
    decodeDouble,
    decodeEnum,
    decodeFixed32,
    decodeFixed64,
    decodeFloat,
    decodeInt32,
    decodeInt64,
    decodeSfixed32,
    decodeSfixed64,
    decodeSint32,
    decodeSint64,
    decodeString,
    decodeUint32,
    decodeUint64,
} from './basic'

/**
 * Decode a protobuf message according to a binary stream.
 */
export function decode(
    bin: Readonly<Uint8Array>,
    obj: Message,
): void | Exception {
    const messageName = obj.protobufInternal.messageName
    const registry = obj.protobufInternal.registry
    const decoder = new Decoder()
    const result = decoder.decode(bin, messageName, registry)
    if (isException(result))
        return result
    // tslint:disable-next-line: no-object
    Object.assign(obj, result)
}

class Decoder {
    public decode(
        bin: Readonly<Uint8Array>,
        messageName: string,
        registry: Readonly<Registry>,
    ): Readonly<Message> | Exception {
        if (bin === undefined)
            return new ExceptionBuilder()
                .message('Input binary stream is undefined.')
                .build()
        if (registry === undefined)
            return new ExceptionBuilder().message('Missing registry.').build()
        this._bin = bin
        this._registry = registry
        const err = this._decodeInternal(messageName)
        if (isException(err))
            return err
        return this._obj
    }
    private _offset = 0
    private _bin: Readonly<Uint8Array> = new Uint8Array(0)
    private _field = 0
    private _wire: WireType = 0
    /**
     * This._fd is under strictly control and it won't be undefined before use.
     */
    private _fd!: FieldDescriptorProto
    /**
     * This._obj is under strictly control and it won't be undefined before use.
     */
    private _obj!: Message
    private _registry: Readonly<Registry> = new Registry()

    private get _isEOF(): boolean {
        return this._offset === this._bin.length
    }

    // tslint:disable-next-line: max-func-body-length
    private _decodeInternal(messageName: string): void | Exception {
        const descriptor = this._registry.getMessage(messageName)
        if (descriptor === undefined)
            return new ExceptionBuilder()
                .message(`Fail to get descriptor by '${messageName}'.`)
                .build()
        const constructor = this._registry.getConstructor(messageName)
        if (constructor !== undefined)
            this._obj = Reflect.construct(constructor, []).getImpl()
        if (descriptor.options.mapEntry) {
            /**
             * Set defalut key.
             */
            const keyDefalut = descriptor.field.find((
                f: FieldDescriptorProto,
            ): boolean => f.name === 'key')?.type === Type.TYPE_STRING ? '' : 0
            this._obj = new MapEntryBuilder().key(keyDefalut).build()
        }
        if (this._obj === undefined)
            return new ExceptionBuilder()
                .message(`Fail to get constructor by '${messageName}'.`)
                .build()
        while (!this._isEOF) {
            const curOffset = this._offset
            const keyBin = this._getVarintBin()
            if (isException(keyBin))
                return keyBin
            this._decodeKey(keyBin)
            const valueBin = this._getValueBin()
            if (isException(valueBin))
                return valueBin
            /**
             * Originally, proto3 messages always discarded unknown fields
             * during parsing. But in versions 3.5 and later, unknown fields are
             * retained during parsing and included in the serialized output.
             * At present we discard it.
             */
            if (isException(this._getFieldDescriptor(descriptor))) {
                this._setExtension(this._bin.slice(curOffset, this._offset))
                continue
            }
            const attrName = toCamelCase(this._fd.name)
            /**
             * Decode singular value.
             */
            if (this._fd.label !== Label.REPEATED) {
                const value = this._decodeValue(valueBin)
                if (isException(value))
                    return value
                Reflect.set(this._obj, attrName, value)
                continue
            }
            /**
             * Decode repeated value.
             */
            const values = this._decodeRepeated(valueBin)
            if (isException(values))
                return values
            this._setRepeatedValue(attrName, values)
        }
    }

    /**
     * Each byte in a varint, except the last byte, has the most significant bit
     * (msb) set. To get the ending byte of a varint is to find a byte whose msb
     * is not set (0b 0xxx xxxx). It means this byte is smaller than 128.
     */
    private _getVarintBin(): Readonly<Uint8Array> | Exception {
        const start = this._offset
        const b128 = 0x80
        let end = -1
        for (let i = start; i < this._bin.length; i += 1)
            if (this._bin[i] < b128) {
                end = i
                break
            }
        if (end < 0)
            return new ExceptionBuilder()
                .message('Unexpected bytes EOF.')
                .build()
        this._offset = end + 1
        return this._bin.slice(start, this._offset)
    }

    /**
     * Each key in the streamed message is a varint with the number
     * (field_number << 3) | wire_type.
     */
    private _decodeKey(bin: Readonly<Uint8Array>): void {
        const b7 = 0x07
        this._wire = bin[0] & b7
        /**
         * The field number is between 1 ~ 2^29-1, so it is safe to right shift
         * 3 bits.
         */
        const wireLen = 3
        this._field = decodeUint32(bin) >>> wireLen
    }

    /**
     * Get value bin starts from _offset at _bin according to _wire.
     */
    private _getValueBin(): Readonly<Uint8Array> | Exception {
        let valueBin: Readonly<Uint8Array>
        // Deprecated wire type Start group and End group is not considered.
        switch (this._wire) {
        case WireType.VARINT:
            const varintBin = this._getVarintBin()
            if (isException(varintBin))
                return varintBin
            valueBin = varintBin
            break
        case WireType.FIXED64:
            const fixed64Len = 8
            valueBin = this._bin.slice(this._offset, this._offset + fixed64Len)
            this._offset += fixed64Len
            break
        case WireType.LENGTH_DELI:
            /**
             * Wire type length-delimited stars with a varint encoded length
             * followed by the specified number of bytes of data.
             */
            const lenBin = this._getVarintBin()
            if (isException(lenBin))
                return lenBin
            const length = decodeUint32(lenBin)
            valueBin = this._bin.slice(this._offset, this._offset + length)
            this._offset += length
            break
        case WireType.FIXED32:
            const fixed32Len = 4
            valueBin = this._bin.slice(this._offset, this._offset + fixed32Len)
            this._offset += fixed32Len
            break
        default:
            return new ExceptionBuilder()
                .message(`Error wire type ${this._wire}.`)
                .build()
        }
        if (this._offset > this._bin.length)
            return new ExceptionBuilder()
                .message('Unexpected bytes EOF.')
                .build()
        return valueBin
    }

    private _getFieldDescriptor(
        descriptor: Readonly<DescriptorProto>,
    ): void | Exception {
        const fd = descriptor.field.find(
            (value: Readonly<FieldDescriptorProto>): boolean =>
                value.number === this._field,
        )
        if (fd === undefined)
            return new ExceptionBuilder()
                .message('Can\'t find fieldDescritpotProto by field number ' +
                    this._field)
                .build()
        this._fd = fd
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private _decodeValue(
        valueBin: Readonly<Uint8Array>,
    ): Readonly<Value> | Exception {
        const type = this._fd.type
        switch (type) {
        case Type.TYPE_MESSAGE:
            const typeName = this._fd.typeName
            const ctor = this._registry.getConstructor(typeName)
            if (ctor === undefined) {
                const decoder = new Decoder()
                return decoder.decode(valueBin, typeName, this._registry)
            }
            return Reflect.construct(ctor, []).decode(valueBin).getImpl()
        case Type.TYPE_INT32:
            return decodeInt32(valueBin)
        case Type.TYPE_INT64:
            return decodeInt64(valueBin)
        case Type.TYPE_UINT32:
            return decodeUint32(valueBin)
        case Type.TYPE_UINT64:
            return decodeUint64(valueBin)
        case Type.TYPE_SINT32:
            return decodeSint32(valueBin)
        case Type.TYPE_SINT64:
            return decodeSint64(valueBin)
        case Type.TYPE_BOOL:
            return decodeBool(valueBin)
        case Type.TYPE_ENUM:
            return decodeEnum(valueBin)
        case Type.TYPE_FIXED64:
            return decodeFixed64(valueBin)
        case Type.TYPE_SFIXED64:
            return decodeSfixed64(valueBin)
        case Type.TYPE_DOUBLE:
            return decodeDouble(valueBin)
        case Type.TYPE_STRING:
            return decodeString(valueBin)
        case Type.TYPE_BYTES:
            return decodeBytes(valueBin)
        case Type.TYPE_FIXED32:
            return decodeFixed32(valueBin)
        case Type.TYPE_SFIXED32:
            return decodeSfixed32(valueBin)
        case Type.TYPE_FLOAT:
            return decodeFloat(valueBin)
        default:
            return new ExceptionBuilder()
                .message(`Type ${type} is not implemented.`)
                .build()
        }
    }

    /**
     * An unpacked repeated field contains key-value pair.
     * A packed repeated field contains a series of values without key part.
     */
    private _decodeRepeated(
        bin: Readonly<Uint8Array>,
    ): readonly Readonly<Value>[] | Exception {
        const type = this._fd.type
        const wire = getWireType(type)
        this._wire = wire
        /**
         * Repeated field that is not packed.
         */
        if (this._wire === WireType.LENGTH_DELI || ! this._fd.options.packed) {
            const value = this._decodeValue(bin)
            if (isException(value))
                return value
            return [value]
        }
        /**
         * Repeated field that is packed.
         */
        /**
         * Because this bin contains a series of value bins, we should set the
         * this._offset back to the start of this bin and split it into values.
         * It is safety to calculate `this_offset -= bin.length` because at last
         * step `this._getValueBin()` has been set `this._offset += bin.length`.
         */
        this._offset -= bin.length
        const start = this._offset
        const values: Readonly<Value>[] = []
        while (this._offset - start < bin.length) {
            const valueBin = this._getValueBin()
            if (isException(valueBin))
                return valueBin
            const value = this._decodeValue(valueBin)
            if (isException(value))
                return value
            values.push(value)
        }
        return values
    }

    private _setRepeatedValue(
        attrName: string,
        values: readonly Readonly<Value>[],
    ): void {
        if (values.length < 1)
            return
        const descriptor = this._registry.getMessage(this._fd.typeName)
        if (!(descriptor !== undefined && descriptor.options.mapEntry)) {
            /**
             * Set Array type values.
             */
            if (!(Reflect.get(this._obj, attrName) instanceof Array))
                Reflect.set(this._obj, attrName, [] as Readonly<Value>[])
            /**
             * This property is certain to be a `Readonly<Value>[]` type because
             * of the `Reflect.set` above.
             */
            const arrayProperty =
                Reflect.get(this._obj, attrName) as Readonly<Value>[]
            values.forEach(v => arrayProperty.push(v))
            return
        }
        /**
         * Set Map type values
         */
        /**
         * Values[0] is certain to be a MapEntry because of the judgement
         * `descriptor.options.mapEntry`.
         */
        const mapMessage = values[0] as Readonly<MapEntry>
        if (mapMessage.key === undefined || mapMessage.value === undefined)
            return
        if (!(Reflect.get(this._obj, attrName) instanceof Map))
            Reflect.set(this._obj, attrName, new Map<string | number, Value>())
        /**
         * This property is certain to be a `Map<string | number, Value>` type
         * because of the `Reflect.set` above.
         */
        const mapProperty =
            Reflect.get(this._obj, attrName) as Map<string | number, Value>
        mapProperty.set(mapMessage.key, mapMessage.value)
    }

    /**
     * At this stage, the type of extension data is unknown. Just store its raw
     * binary. Actual decode will execute when use function `getExtension` with
     * the extension descriptor.
     */
    private _setExtension(raw: Readonly<Uint8Array>): Exception | void {
        const extData = Reflect.get(this._obj, '_ext')
        const exception = new ExceptionBuilder()
            .message(`Unknown field number ${this._field}.`)
            .build()
        if (!isExtension(extData))
            return exception
        const findExtRange = extData.extensionRange.findIndex((
            extRange: ExtensionRange,
        ): boolean =>
        extRange.start <= this._field && this._field < extRange.end)
        if (findExtRange < 0)
            return exception
        let curRaw = new Uint8Array(raw)
        const preRaw = extData.extensionMap.get(this._field)?.raw
        // Append unpacked repeated Value.
        if (preRaw != undefined) {
            const bufs = concat([new Uint8Array(preRaw), curRaw])
            curRaw = new Uint8Array(bufs)
        }
        extData.extensionMap.set(
            this._field,
            new ExtensionDataBuilder().raw(curRaw).build(),
        )
    }
// tslint:disable-next-line: max-file-line-count
}
