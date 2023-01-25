import {Builder} from '../../common/builder'
import {Exception, ExceptionBuilder} from '../../common/exception'
import {Impl} from '../../common/mapped_types'

import {decode} from '../decode/message'

import {Message, ProtobufInternal, Value} from './base'
import {
    DescriptorProto,
    DescriptorProtoBuilder,
    FileDescriptorProtoBuilder,
    Type,
} from './descriptor'
import {
    Extension as ExtensionInternal,
    ExtensionData,
    ExtensionDataBuilder,
    ExtensionDescriptor,
    ExtensionRange,
} from './extension'
import {CtorType, Registry} from './registry'

export interface Extension extends ExtensionInternal {
    getExtension(
        extDesc: ExtensionDescriptor,
    ): Value | readonly Value[] | Exception | undefined
    setExtension(
        desc: ExtensionDescriptor,
        value: Value | readonly Value [],
    ): Exception | void
}

class ExtensionImpl implements Impl<Extension>, Impl<ExtensionInternal> {
    public extensionMap = new Map<number, ExtensionData>()
    public extensionRange: readonly ExtensionRange[] = []

    /**
     * Get extension data from a message according to the extension descriptor
     * providered.
     */
    // tslint:disable-next-line: max-func-body-length
    public getExtension(
        extDesc: ExtensionDescriptor,
    ): Value | readonly Value[] | Exception | undefined {
        const findExtRange = this.extensionRange.findIndex((
            extRange: ExtensionRange,
        ): boolean =>
        extRange.start <= extDesc.field && extDesc.field < extRange.end)
        if (findExtRange < 0)
            return new ExceptionBuilder()
                .message(
                    `Field number ${extDesc.field} is out of extension range.`,
                )
                .build()
        const ext = this.extensionMap.get(extDesc.field)
        /**
         * This extension data have not been set.
         */
        if (ext === undefined)
            return
        if (ext.value != undefined)
            return ext.value
        /**
         * The extension data haven't been decoded. Use decode it and store it
         * in a temporary message ExtValue.
         */
        const fileDescriptorProto = new FileDescriptorProtoBuilder()
            .package('base.ts.common.proto.utils')
            .messageType([
                new DescriptorProtoBuilder()
                    .name('ExtValue')
                    .field([extDesc.fieldDescriptor])
                    .build(),
            ])
            .build()
        const registry = new Registry()
        registry.putFile(fileDescriptorProto)
        registry.putConstructor(
            '.base.ts.common.proto.utils.ExtValue',
            ExtValueBuilder,
        )
        if (extDesc.fieldDescriptor.type === Type.TYPE_MESSAGE) {
            if (extDesc.registry === undefined)
                return new ExceptionBuilder()
                    .message('Decode message type without enough information.')
                    .build()
            const extRegistry = extDesc.registry
            extRegistry.getAllMessage().forEach((
                d: DescriptorProto,
                name: string,
            ): void => {
                registry.getAllMessage().set(name, d)
            })
            extRegistry.getAllConstructor().forEach((
                obj: CtorType,
                name: string,
            ): void => {
                registry.putConstructor(name, obj)
            })
        }
        const extValue = new ExtValueBuilder()
            .protobufInternal({
                fileDescriptorProto,
                messageName: '.base.ts.common.proto.utils.ExtValue',
                registry,
            })
            .build()
        decode(ext.raw, extValue)
        const value = Reflect.get(extValue, extDesc.fieldDescriptor.jsonName)
        if (value === undefined)
            return new ExceptionBuilder()
                .message('Decode extension data failed.')
                .build()
        const extDecoded = new ExtensionDataBuilder()
            .descriptor(extDesc)
            .value(value)
            .raw(ext.raw)
            .build()
        this.extensionMap.set(extDesc.field, extDecoded)
        return value
    }

    /**
     * Set extension data to a message that can be extended.
     */
    public setExtension(
        desc: ExtensionDescriptor,
        value: Value | readonly Value [],
    ): Exception | void {
        const findExtRange = this.extensionRange.findIndex((
            extRange: ExtensionRange,
        ): boolean =>
        extRange.start <= desc.field && desc.field <= extRange.end)
        if (findExtRange < 0)
            return new ExceptionBuilder()
                .message(
                    `Field number ${desc.field} is out of extension range.`,
                )
                .build()
        const ext = new ExtensionDataBuilder()
            .descriptor(desc)
            .value(value)
            .build()
        this.extensionMap.set(desc.field, ext)
    }
}

export class ExtensionBuilder extends Builder<Extension, ExtensionImpl> {
    public constructor(obj?: Readonly<Extension>) {
        const impl = new ExtensionImpl()
        if (obj)
            ExtensionBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public extensionMap(extensionMap: Map<number, ExtensionData>): this {
        this.getImpl().extensionMap = extensionMap
        return this
    }

    public extensionRange(extensionRange: readonly ExtensionRange[]): this {
        this.getImpl().extensionRange = extensionRange
        return this
    }

    protected get daa(): readonly string[] {
        return ExtensionBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = []
}

export function isExtension(obj: unknown): obj is Extension {
    return obj instanceof ExtensionImpl
}

/**
 * ExtValue is a temporary message in order to decode the extension date and
 * store it.
 */
class ExtValue implements Message {
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

// tslint:disable-next-line: no-empty-class
class ExtValueBuilder extends Builder<Message, ExtValue> {
    public constructor(obj?: Readonly<ExtValue>) {
        const impl = new ExtValue()
        if (obj)
            ExtensionBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public protobufInternal(value: Readonly<ProtobufInternal>): this {
        this.getImpl().protobufInternal = value
        return this
    }
}
