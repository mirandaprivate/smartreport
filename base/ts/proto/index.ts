// tslint:disable-next-line: limit-for-build-index
export {encode} from './encode/message'
export {decode} from './decode/message'

export {
    MapEntry,
    MapEntryBuilder,
    Message,
    ProtobufInternal,
    Value,
    WireType,
    getWireType,
    toCamelCase,
} from './lib/base'

export {CtorType, GLOBAL_REGISTRY, Registry} from './lib/registry'

export {Extension, ExtensionBuilder} from './lib/ext_method'

export {
    ExtensionData,
    ExtensionDataBuilder,
    ExtensionDescriptor,
    ExtensionDescriptorBuilder,
    ExtensionRange,
    ExtensionRangeBuilder,
} from './lib/extension'

export {toJson} from './lib/json/to_json'

export {fromJson} from './lib/json/from_json'

export {decodeAny} from './lib/any'

export {
    CType,
    DescriptorProto,
    DescriptorProtoBuilder,
    EnumDescriptorProto,
    EnumDescriptorProtoBuilder,
    EnumOptions,
    EnumOptionsBuilder,
    EnumReservedRange,
    EnumReservedRangeBuilder,
    EnumValueDescriptorProto,
    EnumValueDescriptorProtoBuilder,
    EnumValueOptions,
    EnumValueOptionsBuilder,
    ExtensionRange as DescExtensionRange,
    ExtensionRangeBuilder as DescExtensionRangeBuilder,
    ExtensionRangeOptions,
    ExtensionRangeOptionsBuilder,
    FieldDescriptorProto,
    FieldDescriptorProtoBuilder,
    FieldOptions,
    FieldOptionsBuilder,
    FileDescriptorProto,
    FileDescriptorProtoBuilder,
    FileOptions,
    FileOptionsBuilder,
    IdempotencyLevel,
    JsType,
    Label,
    Location,
    LocationBuilder,
    MessageOptions,
    MessageOptionsBuilder,
    MethodDescriptorProto,
    MethodDescriptorProtoBuilder,
    MethodOptions,
    MethodOptionsBuilder,
    OneofDescriptorProto,
    OneofDescriptorProtoBuilder,
    OneofOptions,
    OneofOptionsBuilder,
    OptimizeMode,
    ReservedRange,
    ServiceDescriptorProto,
    ServiceDescriptorProtoBuilder,
    ServiceOptions,
    ServiceOptionsBuilder,
    SourceCodeInfo,
    SourceCodeInfoBuilder,
    Type,
} from './lib/descriptor'
