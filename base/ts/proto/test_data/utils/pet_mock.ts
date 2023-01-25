// tslint:disable:no-magic-numbers
import {Builder} from '../../common/builder'
import {Exception} from '../../common/exception'
import {Impl} from '../../common/mapped_types'

import {
    decode,
    encode,
    Extension,
    ExtensionBuilder,
    ExtensionDescriptorBuilder,
    ExtensionRangeBuilder,
    fromJson,
    Message,
    Registry,
    toJson,
} from '../../index'
// tslint:disable-next-line: no-wildcard-import
import * as desc from '../../lib/descriptor'

const FILE_DESCRIPTOR = buildFileDescriptor()

export interface Animal extends Message {
    readonly name: string
    readonly _ext: Extension
    toJson(indent?: string | number): string
}

class AnimalImpl implements Impl<Animal> {
    public name = ''
    public _ext = new ExtensionBuilder()
        .extensionRange([
            new ExtensionRangeBuilder().start(100).end(1000).build(),
        ])
        .build()
    public protobufInternal = {
        fileDescriptorProto: FILE_DESCRIPTOR,
        messageName: '.base.ts.common.proto.Animal',
        registry: REGISTRY,
    }

    public encode(): Readonly<Uint8Array> | Exception {
        return encode(this)
    }

    public toJson(indent: string | number = ''): string {
        return toJson(this, indent)
    }

    public clone(): Message {
        return this
    }
}

export class AnimalBuilder extends Builder<Animal, AnimalImpl> {
    public constructor(obj?: Readonly<Animal>) {
        const impl = new AnimalImpl()
        if (obj)
            AnimalBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public fromJson(content: string): this {
        // tslint:disable-next-line: no-object
        Object.assign(this.getImpl(), fromJson(content, this.getImpl()))
        return this
    }

    public decode(bin: Readonly<Uint8Array>): this {
        decode(bin, this.getImpl())
        return this
    }

    protected get dda(): readonly string[] {
        return AnimalBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

export function isAnimal(obj: unknown): obj is Animal {
    return obj instanceof AnimalImpl
}

export interface Type extends Message {
    readonly name: string
}

class TypeImpl implements Impl<Type> {
    public name!: string

    public protobufInternal = {
        fileDescriptorProto: FILE_DESCRIPTOR,
        messageName: '.base.ts.common.proto.Type',
        registry: REGISTRY,
    }

    public encode(): Readonly<Uint8Array> | Exception {
        return encode(this)
    }

    public toJson(indent: string | number = ''): string {
        return toJson(this, indent)
    }

    public clone(): Message {
        return this
    }
}

export class TypeBuilder extends Builder<Type, TypeImpl> {
    public constructor(obj?: Readonly<Type>) {
        const impl = new TypeImpl()
        if (obj)
            TypeBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public decode(bin: Readonly<Uint8Array>): this {
        decode(bin, this.getImpl())
        return this
    }

    protected get dda(): readonly string[] {
        return TypeBuilder.__DDA_PROPS__
    }
    protected static readonly __DDA_PROPS__: readonly string[] = []
}

export function isType(obj: unknown): obj is Type {
    return obj instanceof TypeImpl
}

function buildFileDescriptor(): desc.FileDescriptorProto {
    const animalNameField = new desc.FieldDescriptorProtoBuilder()
        .name('name')
        .number(1)
        .label(desc.Label.REQUIRED)
        .type(desc.Type.TYPE_STRING)
        .jsonName('name')
        .build()
    const animalDesc = new desc.DescriptorProtoBuilder()
        .name('Animal')
        .field([animalNameField])
        .build()
    const typeNameField = new desc.FieldDescriptorProtoBuilder()
        .name('name')
        .number(1)
        .label(desc.Label.REQUIRED)
        .type(desc.Type.TYPE_STRING)
        .jsonName('name')
        .build()
    const typeDesc = new desc.DescriptorProtoBuilder()
        .name('Type')
        .field([typeNameField])
        .build()
    return new desc.FileDescriptorProtoBuilder()
        .name('src/ts/common/proto/test_data/pet.proto')
        .package('base.ts.common.proto')
        .messageType([animalDesc, typeDesc])
        .syntax('proto2')
        .build()
}

export const REGISTRY = registryInit()

function registryInit(): Readonly<Registry> {
    const registry = new Registry()
    registry.putFile(FILE_DESCRIPTOR)
    registry.putConstructor('.base.ts.common.proto.Animal', AnimalBuilder)
    registry.putConstructor('.base.ts.common.proto.Type', TypeBuilder)
    return registry
}

export const E_AGE = new ExtensionDescriptorBuilder()
    .extended('.base.ts.common.proto.Animal')
    .name('.base.ts.common.proto.age')
    .field(100)
    .fieldDescriptor(new desc.FieldDescriptorProtoBuilder()
        .number(100)
        .name('age')
        .jsonName('age')
        .label(desc.Label.OPTIONAL)
        .type(desc.Type.TYPE_INT32)
        .build())
    .fileName('src/ts/common/proto/test_data/pet.proto')
    .build()

export const E_NUMBER = new ExtensionDescriptorBuilder()
    .extended('.base.ts.common.proto.Animal')
    .name('.base.ts.common.proto.number')
    .field(101)
    .fieldDescriptor(new desc.FieldDescriptorProtoBuilder()
        .number(101)
        .name('age')
        .jsonName('age')
        .label(desc.Label.REPEATED)
        .type(desc.Type.TYPE_INT32)
        .options(new desc.FieldOptionsBuilder().packed(false).build())
        .build())
    .fileName('src/ts/common/proto/test_data/pet.proto')
    .build()

export const E_TYPE = new ExtensionDescriptorBuilder()
    .extended('.base.ts.common.proto.Animal')
    .field(102)
    .fieldDescriptor(new desc.FieldDescriptorProtoBuilder()
        .number(102)
        .name('type')
        .jsonName('type')
        .label(desc.Label.OPTIONAL)
        .type(desc.Type.TYPE_MESSAGE)
        .typeName('.base.ts.common.proto.Type')
        .build())
    .registry(new AnimalBuilder().build().protobufInternal.registry)
    .name('.base.ts.common.proto.type')
    .fileName('src/ts/common/proto/test_data/pet.proto')
    .build()
