import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'

import {Value} from './base'
import {FieldDescriptorProto} from './descriptor'
import {Registry} from './registry'

export interface Extension {
    readonly extensionMap: Map<number, ExtensionData>
    readonly extensionRange: readonly ExtensionRange[]
}

class ExtensionImpl implements Impl<Extension> {
    public extensionMap = new Map<number, ExtensionData>()
    public extensionRange: readonly ExtensionRange[] = []
}

export class ExtensionBuilder
    extends Builder<Extension, ExtensionImpl> {
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

    protected get dda(): readonly string[] {
        return ExtensionBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

// tslint:disable-next-line: unknown-paramenter-for-type-predicate
export function isExtension(obj: object): obj is Extension {
    return obj !== undefined &&
        Reflect.get(obj, 'extensionMap') instanceof Map &&
        Reflect.get(obj, 'extensionRange') instanceof Array
}

export interface ExtensionData {
    readonly descriptor: ExtensionDescriptor
    readonly value: Value | readonly Value[]
    readonly raw: Readonly<Uint8Array>
}

class ExtensionDataImpl implements Impl<ExtensionData> {
    public descriptor!: ExtensionDescriptor
    public value!: Value | readonly Value[]
    public raw: Readonly<Uint8Array> = new Uint8Array(0)
}

export class ExtensionDataBuilder
    extends Builder<ExtensionData, ExtensionDataImpl> {
    public constructor(obj?: Readonly<ExtensionData>) {
        const impl = new ExtensionDataImpl()
        if (obj)
            ExtensionDataBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public descriptor(descriptor: ExtensionDescriptor): this {
        this.getImpl().descriptor = descriptor
        return this
    }

    public value(value: Value | readonly Value[]): this {
        this.getImpl().value = value
        return this
    }

    public raw(raw: Readonly<Uint8Array>): this {
        this.getImpl().raw = raw
        return this
    }

    protected get dda(): readonly string[] {
        return ExtensionDataBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

export function isExtensionData(obj: unknown): obj is ExtensionData {
    return obj instanceof ExtensionDataImpl
}

export interface ExtensionDescriptor {
    readonly extended: string
    readonly name: string
    readonly field: number
    readonly fieldDescriptor: FieldDescriptorProto
    readonly registry?: Readonly<Registry>
    readonly fileName: string
}

class ExtensionDescriptorImpl implements Impl<ExtensionDescriptor> {
    public extended!: string
    public name!: string
    public field!: number
    public fieldDescriptor!: FieldDescriptorProto
    /**
     * Provide enough infomation for message type to encode or decode.
     */
    public registry?: Readonly<Registry>
    public fileName!: string
}

// tslint:disable-next-line: max-classes-per-file
export class ExtensionDescriptorBuilder
    extends Builder<ExtensionDescriptor, ExtensionDescriptorImpl> {
    public constructor(obj?: Readonly<ExtensionDescriptor>) {
        const impl = new ExtensionDescriptorImpl()
        if (obj)
            ExtensionDescriptorBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public extended(extended: string): this {
        this.getImpl().extended = extended
        return this
    }

    public registry(registry: Readonly<Registry>): this {
        this.getImpl().registry = registry
        return this
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public field(field: number): this {
        this.getImpl().field = field
        return this
    }

    public fieldDescriptor(fieldDescriptor: FieldDescriptorProto): this {
        this.getImpl().fieldDescriptor = fieldDescriptor
        return this
    }

    public fileName(fileName: string): this {
        this.getImpl().fileName = fileName
        return this
    }

    protected get dda(): readonly string[] {
        return ExtensionDescriptorBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

export function isExtendsionDesc(obj: unknown): obj is ExtensionDescriptor {
    return obj instanceof ExtensionDescriptorImpl
}

export interface ExtensionRange {
    readonly start: number
    readonly end: number
}

// tslint:disable-next-line: max-classes-per-file
class ExtensionRangeImpl implements Impl<ExtensionRange> {
    public start!: number
    public end!: number
}

// tslint:disable-next-line: max-classes-per-file
export class ExtensionRangeBuilder
    extends Builder<ExtensionRange, ExtensionRangeImpl> {
    public constructor(obj?: Readonly<ExtensionRange>) {
        const impl = new ExtensionRangeImpl()
        if (obj)
            ExtensionRangeBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public start(start: number): this {
        this.getImpl().start = start
        return this
    }

    public end(end: number): this {
        this.getImpl().end = end
        return this
    }

    protected get dda(): readonly string[] {
        return ExtensionRangeBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

export function isExtensionRange(obj: unknown): obj is ExtensionRange {
    return obj instanceof ExtensionRangeImpl
}
