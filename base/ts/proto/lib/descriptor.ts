// tslint:disable:max-classes-per-file
/**
 * {@link google/protobuf/descriptor.proto}
 */
import {Builder} from '../../common/builder'

export interface DescriptorProto {
    readonly name: string
    readonly field: readonly Readonly<FieldDescriptorProto>[]
    readonly extension: readonly Readonly<FieldDescriptorProto>[]
    readonly nestedType: readonly Readonly<DescriptorProto>[]
    readonly enumType: readonly Readonly<EnumDescriptorProto>[]
    readonly extensionRange: readonly Readonly<ExtensionRange>[]
    readonly oneofDecl: readonly Readonly<OneofDescriptorProto>[]
    readonly options: Readonly<MessageOptions>
}

class DescriptorProtoImpl implements DescriptorProto {
    public name!: string
    public field: readonly Readonly<FieldDescriptorProto>[] = []
    public extension: readonly Readonly<FieldDescriptorProto>[] = []
    public nestedType: readonly Readonly<DescriptorProto>[] = []
    public enumType: readonly Readonly<EnumDescriptorProto>[] = []
    public extensionRange: readonly Readonly<ExtensionRange>[] = []
    public oneofDecl: readonly Readonly<OneofDescriptorProto>[] = []
    public options = new MessageOptionsBuilder().build()
}

export class DescriptorProtoBuilder extends
    Builder<DescriptorProto, DescriptorProtoImpl> {
    public constructor(obj?: Readonly<DescriptorProto>) {
        const impl = new DescriptorProtoImpl()
        if (obj)
            DescriptorProtoBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public name(value: string): this {
        this.getImpl().name = value
        return this
    }

    public field(value: readonly Readonly<FieldDescriptorProto>[]): this {
        this.getImpl().field = value
        return this
    }

    public extension(value: readonly Readonly<FieldDescriptorProto>[]): this {
        this.getImpl().extension = value
        return this
    }

    public nestedType(value: readonly Readonly<DescriptorProto>[]): this {
        this.getImpl().nestedType = value
        return this
    }

    public enumType(value: readonly Readonly<EnumDescriptorProto>[]): this {
        this.getImpl().enumType = value
        return this
    }

    public extensionRange(value: readonly Readonly<ExtensionRange>[]): this {
        this.getImpl().extensionRange = value
        return this
    }

    public oneofDecl(value: readonly Readonly<OneofDescriptorProto>[]): this {
        this.getImpl().oneofDecl = value
        return this
    }

    public options(value: Readonly<MessageOptions>): this {
        this.getImpl().options = value
        return this
    }
}

export interface OneofDescriptorProto {
    readonly name: string
    readonly options: Readonly<OneofOptions>
}

class OneofDescriptorProtoImpl implements OneofDescriptorProto {
    public name!: string
    public options = new OneofOptionsBuilder().build()
}

export class OneofDescriptorProtoBuilder extends
    Builder<OneofDescriptorProto, OneofDescriptorProtoImpl> {
    public constructor(obj?: Readonly<OneofDescriptorProto>) {
        const impl = new OneofDescriptorProtoImpl()
        if (obj)
            OneofDescriptorProtoBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public options(options: Readonly<OneofOptions>): this {
        this.getImpl().options = options
        return this
    }
}

export interface OneofOptions {
    readonly extension: Map<number, Uint8Array>
}

class OneofOptionsImpl implements OneofOptions {
    public extension!: Map<number, Uint8Array>
}

export class OneofOptionsBuilder
    extends Builder<OneofOptions, OneofOptionsImpl> {
    public constructor(obj?: Readonly<OneofOptions>) {
        const impl = new OneofOptionsImpl()
        if (obj)
            OneofOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface MessageOptions {
    readonly messageSetWireFormat: boolean
    readonly noStandardDescriptorAccessor: boolean
    readonly deprecated: boolean
    readonly mapEntry: boolean
    readonly extension: Map<number, Uint8Array>
}

class MessageOptionsImpl implements MessageOptions {
    public messageSetWireFormat = false
    public noStandardDescriptorAccessor = false
    public deprecated = false
    public mapEntry = false
    public extension!: Map<number, Uint8Array>
}

export class MessageOptionsBuilder
    extends Builder<MessageOptions, MessageOptionsImpl> {
    public constructor(obj?: Readonly<MessageOptions>) {
        const impl = new MessageOptionsImpl()
        if (obj)
            MessageOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public messageSetWireFormat(messageSetWireFormat: boolean): this {
        this.getImpl().messageSetWireFormat = messageSetWireFormat
        return this
    }

    public noStandardDescriptorAccessor(
        noStandardDescriptorAccessor: boolean,
    ): this {
        this.getImpl().noStandardDescriptorAccessor =
            noStandardDescriptorAccessor
        return this
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public mapEntry(mapEntry: boolean): this {
        this.getImpl().mapEntry = mapEntry
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface ExtensionRange {
    readonly start: number
    readonly end: number
    readonly options: Readonly<ExtensionRangeOptions>
}

class ExtensionRangeImpl implements ExtensionRange {
    public start!: number
    public end!: number
    public options = new ExtensionRangeOptionsBuilder().build()
}

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

    public options(options: Readonly<ExtensionRangeOptions>): this {
        this.getImpl().options = options
        return this
    }
}

export interface ExtensionRangeOptions {
    readonly extension: Map<number, Uint8Array>
}

class ExtensionRangeOptionsImpl implements ExtensionRangeOptions {
    public extension!: Map<number, Uint8Array>
}

export class ExtensionRangeOptionsBuilder
    extends Builder<ExtensionRangeOptions, ExtensionRangeOptionsImpl> {
    public constructor(obj?: Readonly<ExtensionRangeOptions>) {
        const impl = new ExtensionRangeOptionsImpl()
        if (obj)
            ExtensionRangeOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface ReservedRange {
    readonly start: number
    readonly end: number
}

export interface FileDescriptorProto {
    /**
     * File name, relative to root of source tree.
     *
     * optional string name = 1;
     */
    readonly name: string
    readonly package: string
    readonly dependency: readonly string[]
    readonly publicDependency: readonly number[]
    readonly weakDependancy: readonly number[]
    readonly messageType: readonly Readonly<DescriptorProto>[]
    readonly enumType: readonly Readonly<EnumDescriptorProto>[]
    readonly service: readonly Readonly<ServiceDescriptorProto>[]
    readonly extension: readonly Readonly<FieldDescriptorProto>[]
    readonly options: Readonly<FileOptions>
    readonly sourceCodeInfo: Readonly<SourceCodeInfo>
    readonly syntax: string
    /**
     *  This field contains optional information about the original source code.
     *  You may safely remove this entire field without harming runtime
     *  functionality of the descriptors -- the information is needed only by
     *  development tools.
     * optional SourceCodeInfo source_code_info = 9;
     *
     *  The syntax of the proto file.
     *  The supported values are "proto2" and "proto3".
     * optional string syntax = 12;
     */
}

class FileDescriptorProtoImpl implements FileDescriptorProto {
    public name!: string
    public package!: string
    public dependency: readonly string[] = []
    public publicDependency: readonly number[] = []
    public weakDependancy: readonly number[] = []
    public messageType: readonly Readonly<DescriptorProto>[] = []
    public enumType: readonly Readonly<EnumDescriptorProto>[] = []
    public service: readonly Readonly<ServiceDescriptorProto>[] = []
    public extension: readonly Readonly<FieldDescriptorProto>[] = []
    public options = new FileOptionsBuilder().build()
    public sourceCodeInfo!: Readonly<SourceCodeInfo>
    public syntax = 'proto3'
}

export class FileDescriptorProtoBuilder extends
    Builder<FileDescriptorProto, FileDescriptorProtoImpl> {
    public constructor(obj?: Readonly<FileDescriptorProto>) {
        const impl = new FileDescriptorProtoImpl()
        if (obj)
            FileDescriptorProtoBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public name(value: string): this {
        this.getImpl().name = value
        return this
    }

    public package(value: string): this {
        this.getImpl().package = value
        return this
    }

    public dependency(value: readonly string[]): this {
        this.getImpl().dependency = value
        return this
    }

    public publicDependency(value: readonly number[]): this {
        this.getImpl().publicDependency = value
        return this
    }

    public messageType(value: readonly Readonly<DescriptorProto>[]): this {
        this.getImpl().messageType = value
        return this
    }

    public enumType(value: readonly Readonly<EnumDescriptorProto>[]): this {
        this.getImpl().enumType = value
        return this
    }

    public service(value: readonly Readonly<ServiceDescriptorProto>[]): this {
        this.getImpl().service = value
        return this
    }

    public extension(value: readonly Readonly<FieldDescriptorProto>[]): this {
        this.getImpl().extension = value
        return this
    }

    public options(value: Readonly<FileOptions>): this {
        this.getImpl().options = value
        return this
    }

    public sourceCodeInfo(value: Readonly<SourceCodeInfo>): this {
        this.getImpl().sourceCodeInfo = value
        return this
    }

    public syntax(value: string): this {
        this.getImpl().syntax = value
        return this
    }
}

export const enum Label {
    OPTIONAL = 0x01,
    REQUIRED = 0x02,
    REPEATED = 0x03,
}

export interface FieldDescriptorProto {
    readonly name: string
    readonly number: number
    readonly label: Label
    readonly type: Type
    readonly typeName: string
    readonly extendee: string
    readonly defaultValue?: string
    readonly oneofIndex?: number
    readonly jsonName: string
    readonly options: Readonly<FieldOptions>
}

class FieldDescriptorProtoImpl implements FieldDescriptorProto {
    public name!: string
    public number!: number
    public label = Label.OPTIONAL
    public type!: Type
    public typeName!: string
    public extendee!: string
    public defaultValue?: string
    public oneofIndex?: number
    public jsonName!: string
    public options = new FieldOptionsBuilder().build()
}

export class FieldDescriptorProtoBuilder extends
    Builder<FieldDescriptorProto, FieldDescriptorProtoImpl> {
    public constructor(obj?: Readonly<FieldDescriptorProto>) {
        const impl = new FieldDescriptorProtoImpl()
        if (obj)
            FieldDescriptorProtoBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public name(value: string): this {
        this.getImpl().name = value
        return this
    }

    public number(value: number): this {
        this.getImpl().number = value
        return this
    }

    public label(value: Label): this {
        this.getImpl().label = value
        return this
    }

    public type(value: Type): this {
        this.getImpl().type = value
        return this
    }

    public extendee(value: string): this {
        this.getImpl().extendee = value
        return this
    }

    public defaultValue(value: string): this {
        this.getImpl().defaultValue = value
        return this
    }

    public jsonName(value: string): this {
        this.getImpl().jsonName = value
        return this
    }

    public typeName(value: string): this {
        this.getImpl().typeName = value
        return this
    }

    public oneofIndex(value: number): this {
        this.getImpl().oneofIndex = value
        return this
    }

    public options(value: FieldOptions): this {
        this.getImpl().options = value
        return this
    }
}

export const enum JsType {
    JS_NORMAL = 0,
    JS_STRING = 1,
    JS_NUMBER = 2,
}

// tslint:disable-next-line: naming-convention
export const enum CType {
    STRING = 0,
    CORD = 1,
    STRING_PIECE = 2,
}

export interface FieldOptions {
    readonly ctype: Readonly<CType>
    readonly packed: boolean
    readonly jstype: Readonly<JsType>
    readonly lazy: boolean // [defaule = false]
    readonly deprecated: boolean // [default = false]
    readonly weak: boolean // [default = false]
    readonly extension: Map<number, Uint8Array>
}

class FieldOptionsImpl implements FieldOptions {
    public ctype = CType.STRING
    public packed!: boolean
    public jstype = JsType.JS_NORMAL
    public lazy = false
    public deprecated = false
    public weak = false
    public extension!: Map<number, Uint8Array>
}

export class FieldOptionsBuilder
    extends Builder<FieldOptions, FieldOptionsImpl> {
    public constructor(obj?: Readonly<FieldOptions>) {
        const impl = new FieldOptionsImpl()
        if (obj)
            FieldOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public ctype(ctype: Readonly<CType>): this {
        this.getImpl().ctype = ctype
        return this
    }

    public packed(packed: boolean): this {
        this.getImpl().packed = packed
        return this
    }

    public jstype(jstype: Readonly<JsType>): this {
        this.getImpl().jstype = jstype
        return this
    }

    public lazy(lazy: boolean): this {
        this.getImpl().lazy = lazy
        return this
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public weak(weak: boolean): this {
        this.getImpl().weak = weak
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

/**
 * All of types in proto message. Consistent with descriptor.proto.
 */
export const enum Type {
    TYPE_DOUBLE = 0x01,
    TYPE_FLOAT = 0x02,
    TYPE_INT64 = 0x03,
    TYPE_UINT64 = 0x04,
    TYPE_INT32 = 0x05,
    TYPE_FIXED64 = 0x06,
    TYPE_FIXED32 = 0x07,
    TYPE_BOOL = 0x08,
    TYPE_STRING = 0x09,
    TYPE_GROUP = 0x0A,
    TYPE_MESSAGE = 0x0B,
    TYPE_BYTES = 0x0C,
    TYPE_UINT32 = 0x0D,
    TYPE_ENUM = 0x0E,
    TYPE_SFIXED32 = 0x0F,
    TYPE_SFIXED64 = 0x10,
    TYPE_SINT32 = 0x11,
    TYPE_SINT64 = 0x12,
}

export const enum OptimizeMode {
    SPEED = 1,
    CODE_SIZE = 2,
    LITE_RUNTIME = 3,
  }

export interface FileOptions {
    readonly javaPackage: string
    readonly javaOuterClassname: string
    readonly javaMultipleFiles: boolean // [default = false]
    readonly javaGenerateEqualsAndHash: boolean // [deprecated=true]
    readonly javaStringCheckUtf8: boolean // [default = false]
    readonly optimizeFor: OptimizeMode // [default = SPEED]
    readonly goPackage: string
    readonly ccGenericServices: boolean // [default = false]
    readonly javaGenericServices: boolean // [default = false]
    readonly pyGenericServices: boolean // [default = false]
    readonly phpGenericServices: boolean // [default = false]
    readonly deprecated: boolean // [default = false]
    readonly ccEnableArenas: boolean // [default = false]
    readonly objcClassPrefix: string
    readonly csharpNamespace: string
    readonly swiftPrefix: string
    readonly phpClassPrefix: string
    readonly phpNamespace: string
    readonly phpMetadataNamespace: string
    readonly rubyPackage: string
    readonly extension: Map<number, Uint8Array>
}

class FileOptionsImpl implements FileOptions {
    public javaPackage!: string
    public javaOuterClassname!: string
    public javaMultipleFiles = false
    public javaGenerateEqualsAndHash = false
    public javaStringCheckUtf8 = false
    public optimizeFor = OptimizeMode.SPEED
    public goPackage!: string
    public ccGenericServices = false
    public javaGenericServices = false
    public pyGenericServices = false
    public phpGenericServices = false
    public deprecated = false
    public ccEnableArenas = false
    public objcClassPrefix!: string
    public csharpNamespace!: string
    public swiftPrefix!: string
    public phpClassPrefix!: string
    public phpNamespace!: string
    public phpMetadataNamespace!: string
    public rubyPackage!: string
    public extension!: Map<number, Uint8Array>
}

export class FileOptionsBuilder extends Builder<FileOptions, FileOptionsImpl> {
    public constructor(obj?: Readonly<FileOptions>) {
        const impl = new FileOptionsImpl()
        if (obj)
            FileOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public javaPackage(javaPackage: string): this {
        this.getImpl().javaPackage = javaPackage
        return this
    }

    public javaOuterClassname(javaOuterClassname: string): this {
        this.getImpl().javaOuterClassname = javaOuterClassname
        return this
    }

    public javaMultipleFiles(javaMultipleFiles: boolean): this {
        this.getImpl().javaMultipleFiles = javaMultipleFiles
        return this
    }

    public javaGenerateEqualsAndHash(javaGenerateEqualsAndHash: boolean): this {
        this.getImpl().javaGenerateEqualsAndHash = javaGenerateEqualsAndHash
        return this
    }

    public javaStringCheckUtf8(javaStringCheckUtf8: boolean): this {
        this.getImpl().javaStringCheckUtf8 = javaStringCheckUtf8
        return this
    }

    public optimizeFor(optimizeFor: OptimizeMode): this {
        this.getImpl().optimizeFor = optimizeFor
        return this
    }

    public goPackage(goPackage: string): this {
        this.getImpl().goPackage = goPackage
        return this
    }

    public ccGenericServices(ccGenericServices: boolean): this {
        this.getImpl().ccGenericServices = ccGenericServices
        return this
    }

    public javaGenericServices(javaGenericServices: boolean): this {
        this.getImpl().javaGenericServices = javaGenericServices
        return this
    }

    public pyGenericServices(pyGenericServices: boolean): this {
        this.getImpl().pyGenericServices = pyGenericServices
        return this
    }

    public phpGenericServices(phpGenericServices: boolean): this {
        this.getImpl().phpGenericServices = phpGenericServices
        return this
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public ccEnableArenas(ccEnableArenas: boolean): this {
        this.getImpl().ccEnableArenas = ccEnableArenas
        return this
    }

    public objcClassPrefix(objcClassPrefix: string): this {
        this.getImpl().objcClassPrefix = objcClassPrefix
        return this
    }

    public csharpNamespace(csharpNamespace: string): this {
        this.getImpl().csharpNamespace = csharpNamespace
        return this
    }

    public swiftPrefix(swiftPrefix: string): this {
        this.getImpl().swiftPrefix = swiftPrefix
        return this
    }

    public phpClassPrefix(phpClassPrefix: string): this {
        this.getImpl().phpClassPrefix = phpClassPrefix
        return this
    }

    public phpNamespace(phpNamespace: string): this {
        this.getImpl().phpNamespace = phpNamespace
        return this
    }

    public phpMetadataNamespace(phpMetadataNamespace: string): this {
        this.getImpl().phpMetadataNamespace = phpMetadataNamespace
        return this
    }

    public rubyPackage(rubyPackage: string): this {
        this.getImpl().rubyPackage = rubyPackage
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface SourceCodeInfo {
    readonly location: readonly Location[]
}

class SourceCodeInfoImpl implements SourceCodeInfo {
    public location: readonly Location[] = []
}

export class SourceCodeInfoBuilder
    extends Builder<SourceCodeInfo, SourceCodeInfoImpl> {
    public constructor(obj?: Readonly<SourceCodeInfo>) {
        const impl = new SourceCodeInfoImpl()
        if (obj)
            SourceCodeInfoBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public location(location: readonly Location[]): this {
        this.getImpl().location = location
        return this
    }
}

export interface Location {
    readonly path: readonly number[]
    readonly span: readonly number[]
    readonly leadingComments: string
    readonly trailingComments: string
    readonly leadingDetachedComments: string
}

class LocationImpl implements Location {
    public path: readonly number[] = []
    public span: readonly number[] = []
    public leadingComments!: string
    public trailingComments!: string
    public leadingDetachedComments!: string
}

export class LocationBuilder extends Builder<Location, LocationImpl> {
    public constructor(obj?: Readonly<Location>) {
        const impl = new LocationImpl()
        if (obj)
            LocationBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public path(path: readonly number[]): this {
        this.getImpl().path = path
        return this
    }

    public span(span: readonly number[]): this {
        this.getImpl().span = span
        return this
    }

    public leadingComments(leadingComments: string): this {
        this.getImpl().leadingComments = leadingComments
        return this
    }

    public trailingComments(trailingComments: string): this {
        this.getImpl().trailingComments = trailingComments
        return this
    }

    public leadingDetachedComments(leadingDetachedComments: string): this {
        this.getImpl().leadingDetachedComments = leadingDetachedComments
        return this
    }
}

export interface ServiceDescriptorProto {
    readonly name: string
    readonly method: readonly Readonly<MethodDescriptorProto>[]
    readonly options: Readonly<ServiceOptions>
}

class ServiceDescriptorProtoImpl implements ServiceDescriptorProto {
    public name!: string
    public method: readonly Readonly<MethodDescriptorProto>[] = []
    public options = new ServiceOptionsBuilder().build()
}

export class ServiceDescriptorProtoBuilder
    extends Builder<ServiceDescriptorProto, ServiceDescriptorProtoImpl> {
    public constructor(obj?: Readonly<ServiceDescriptorProto>) {
        const impl = new ServiceDescriptorProtoImpl()
        if (obj)
            ServiceDescriptorProtoBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public method(method: readonly Readonly<MethodDescriptorProto>[]): this {
        this.getImpl().method = method
        return this
    }

    public options(options: Readonly<ServiceOptions>): this {
        this.getImpl().options = options
        return this
    }
}

export interface ServiceOptions {
    readonly deprecated: boolean
    readonly extension: Map<number, Uint8Array>
}

class ServiceOptionsImpl implements ServiceOptions {
    public deprecated = false
    public extension!: Map<number, Uint8Array>
}

export class ServiceOptionsBuilder
    extends Builder<ServiceOptions, ServiceOptionsImpl> {
    public constructor(obj?: Readonly<ServiceOptions>) {
        const impl = new ServiceOptionsImpl()
        if (obj)
            ServiceOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface MethodDescriptorProto {
    readonly name: string
    readonly inputType: string
    readonly outputType: string
    readonly options: Readonly<MethodOptions>
    readonly clientStreaming: boolean // [default = false]
    readonly serverStreaming: boolean // [default = false]
}

class MethodDescriptorProtoImpl implements MethodDescriptorProto {
    public name!: string
    public inputType!: string
    public outputType!: string
    public options = new MethodOptionsBuilder().build()
    public clientStreaming = false
    public serverStreaming = false
}

export class MethodDescriptorProtoBuilder
    extends Builder<MethodDescriptorProto, MethodDescriptorProtoImpl> {
    public constructor(obj?: Readonly<MethodDescriptorProto>) {
        const impl = new MethodDescriptorProtoImpl()
        if (obj)
            MethodDescriptorProtoBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public inputType(inputType: string): this {
        this.getImpl().inputType = inputType
        return this
    }

    public outputType(outputType: string): this {
        this.getImpl().outputType = outputType
        return this
    }

    public options(options: Readonly<MethodOptions>): this {
        this.getImpl().options = options
        return this
    }

    public clientStreaming(clientStreaming: boolean): this {
        this.getImpl().clientStreaming = clientStreaming
        return this
    }

    public serverStreaming(serverStreaming: boolean): this {
        this.getImpl().serverStreaming = serverStreaming
        return this
    }
}

export interface EnumDescriptorProto {
    readonly name: string
    readonly value: readonly Readonly<EnumValueDescriptorProto>[]
    readonly options: Readonly<EnumOptions>
    readonly reservedRange: readonly Readonly<EnumReservedRange>[]
    readonly reservedName: readonly string[]
}

class EnumDescriptorProtoImpl implements EnumDescriptorProto {
    public name!: string
    public value: readonly Readonly<EnumValueDescriptorProto>[] = []
    public options = new EnumOptionsBuilder().build()
    public reservedRange: readonly Readonly<EnumReservedRange>[] = []
    public reservedName: readonly string[] = []
}

export class EnumDescriptorProtoBuilder extends
    Builder<EnumDescriptorProto, EnumDescriptorProtoImpl> {
    public constructor(obj?: Readonly<EnumDescriptorProto>) {
        const impl = new EnumDescriptorProtoImpl()
        if (obj)
            EnumDescriptorProtoBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public name(value: string): this {
        this.getImpl().name = value
        return this
    }

    public value(value: readonly Readonly<EnumValueDescriptorProto>[]): this {
        this.getImpl().value = value
        return this
    }

    public reservedName(value: readonly string[]): this {
        this.getImpl().reservedName = value
        return this
    }

    public options(value: Readonly<EnumOptions>): this {
        this.getImpl().options = value
        return this
    }

    public reservedRange(value: readonly Readonly<EnumReservedRange>[]): this {
        this.getImpl().reservedRange = value
        return this
    }
}

export interface EnumValueDescriptorProto {
    readonly name: string
    readonly number: number
    readonly options: Readonly<EnumValueOptions>
}

class EnumValueDescriptorProtoImpl implements EnumValueDescriptorProto {
    public name!: string
    public number!: number
    public options = new EnumValueOptionsBuilder().build()
}

export class EnumValueDescriptorProtoBuilder extends
    Builder<EnumValueDescriptorProto, EnumValueDescriptorProtoImpl> {
    public constructor(obj?: Readonly<EnumValueDescriptorProto>) {
        const impl = new EnumValueDescriptorProtoImpl()
        if (obj)
            EnumValueDescriptorProtoBuilder.shallowCopy(obj, impl)
        super(impl)
    }

    public name(value: string): this {
        this.getImpl().name = value
        return this
    }

    public number(value: number): this {
        this.getImpl().number = value
        return this
    }

    public options(value: Readonly<EnumValueOptions>): this {
        this.getImpl().options = value
        return this
    }
}

export interface EnumValueOptions {
    readonly deprecated: boolean // Default false
    readonly extension: Map<number, Uint8Array>
}

class EnumValueOptionsImpl implements EnumValueOptions {
    public deprecated = false
    public extension!: Map<number, Uint8Array>
}

export class EnumValueOptionsBuilder
    extends Builder<EnumValueOptions, EnumValueOptionsImpl> {
    public constructor(obj?: Readonly<EnumValueOptions>) {
        const impl = new EnumValueOptionsImpl()
        if (obj)
            EnumValueOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface EnumReservedRange {
    readonly start: number
    readonly end: number
}

class EnumReservedRangeImpl implements EnumReservedRange {
    public start!: number
    public end!: number
}

export class EnumReservedRangeBuilder
    extends Builder<EnumReservedRange, EnumReservedRangeImpl> {
    public constructor(obj?: Readonly<EnumReservedRange>) {
        const impl = new EnumReservedRangeImpl()
        if (obj)
            EnumReservedRangeBuilder.shallowCopy(impl, obj)
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
}

export interface EnumOptions {
    readonly allowAlias: boolean
    readonly deprecated: boolean // Default false.
    readonly extension: Map<number, Uint8Array>
}

class EnumOptionsImpl implements EnumOptions {
    public allowAlias!: boolean
    public deprecated!: boolean
    public extension!: Map<number, Uint8Array>
}

export class EnumOptionsBuilder extends Builder<EnumOptions, EnumOptionsImpl> {
    public constructor(obj?: Readonly<EnumOptions>) {
        const impl = new EnumOptionsImpl()
        if (obj)
            EnumOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public allowAlias(allowAlias: boolean): this {
        this.getImpl().allowAlias = allowAlias
        return this
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export interface MethodOptions {
    readonly deprecated: boolean // [default = false]
    readonly idempotencyLevel: Readonly<IdempotencyLevel>
    readonly extension: Map<number, Uint8Array>
}

class MethodOptionsImpl implements MethodOptions {
    public deprecated!: boolean
    public idempotencyLevel = IdempotencyLevel.IDEMPOTENCY_UNKNOWN
    public extension!: Map<number, Uint8Array>
}

export class MethodOptionsBuilder
    extends Builder<MethodOptions, MethodOptionsImpl> {
    public constructor(obj?: Readonly<MethodOptions>) {
        const impl = new MethodOptionsImpl()
        if (obj)
            MethodOptionsBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public deprecated(deprecated: boolean): this {
        this.getImpl().deprecated = deprecated
        return this
    }

    public idempotencyLevel(
        idempotencyLevel: Readonly<IdempotencyLevel>,
    ): this {
        this.getImpl().idempotencyLevel = idempotencyLevel
        return this
    }

    public extension(extension: Map<number, Uint8Array>): this {
        this.getImpl().extension = extension
        return this
    }
}

export const enum IdempotencyLevel {
    IDEMPOTENCY_UNKNOWN = 0,
    NO_SIDE_EFFECTS = 1,
    IDEMPOTENT = 2,
// tslint:disable-next-line: max-file-line-count
}
