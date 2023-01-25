import {
    DescriptorProto,
    EnumDescriptorProto,
    FileDescriptorProto,
} from './descriptor'

/**
 * The names are fully qualified names.
 */
export class Registry {
    /**
     * Get the message descriptor according to the fully qualified name.
     */
    // tslint:disable-next-line: no-unnecessary-method-declaration
    public getMessage(name: string): Readonly<DescriptorProto> | undefined {
        return this._messageRegistry.get(name)
    }

    /**
     * Get all message descriptor registered in this registry.
     */
    public getAllMessage(): Map<string, DescriptorProto> {
        return this._messageRegistry
    }

    /**
     * Get the construtor of this message accroding to the fully qualified
     * name.
     */
    // tslint:disable-next-line: no-unnecessary-method-declaration
    public getConstructor(name: string): CtorType | undefined {
        return this._constructorRegistry.get(name)
    }

    /**
     * Get all registered constructors in this registry.
     */
    public getAllConstructor(): Map<string, CtorType> {
        return this._constructorRegistry
    }

    /**
     * Get the enum descriptor accroding to the fully qualified name.
     */
    // tslint:disable-next-line: no-unnecessary-method-declaration
    public getEnum(name: string): Readonly<EnumDescriptorProto> | undefined {
        return this._enumRegistry.get(name)
    }

    /**
     * Get all registered enums in this registry.
     */
    public getAllEnum(): Map<string, EnumDescriptorProto> {
        return this._enumRegistry
    }

    /**
     * Register a file descriptor. It registers all message and enum descriptor
     * in this file descritor.
     */
    public putFile(fileDescriptor: Readonly<FileDescriptorProto>): void {
        const name = fileDescriptor.package === ''
            ? ''
            : `.${fileDescriptor.package}`
        fileDescriptor.messageType
            .forEach((descriptor: Readonly<DescriptorProto>): void => {
                this.putMessage(descriptor, name)
            })
        fileDescriptor.enumType
            .forEach((enumDesc: Readonly<EnumDescriptorProto>): void => {
                this._enumRegistry.set(`${name}.${enumDesc.name}`, enumDesc)
            })
    }

    /**
     * Register a message descriptor according to the scope.
     */
    public putMessage(
        descriptor: Readonly<DescriptorProto>,
        scope: string,
    ): void {
        const name = `${scope}.${descriptor.name}`
        this._messageRegistry.set(name, descriptor)
        descriptor.nestedType.forEach((
            nested: Readonly<DescriptorProto>,
        ): void => this.putMessage(nested, name))
        descriptor.enumType
            .forEach((enumDesc: Readonly<EnumDescriptorProto>): void => {
                this._enumRegistry.set(`${name}.${enumDesc.name}`, enumDesc)
            })
    }

    /**
     * Register a constructor according to the fully qualified name.
     */
    // tslint:disable-next-line: no-unnecessary-method-declaration
    public putConstructor(messageName: string, obj: CtorType): void {
        this._constructorRegistry.set(messageName, obj)
    }

    private readonly _messageRegistry = new Map<string, DescriptorProto>()

    private readonly _constructorRegistry = new Map<string, CtorType>()
    private readonly _enumRegistry = new Map<string, EnumDescriptorProto>()
}

export type CtorType = new () => object

class GlobalRegistry extends Registry {
    public putConstructor(messageName: string, obj: CtorType): void {
        const ctor = this.getConstructor(messageName)
        if (ctor !== undefined)
            // tslint:disable-next-line: no-throw-unless-asserts
            throw Error(`Duplicate fully qualified name '${messageName}'.` +
                'Please add a package name for the proto file this message in.')
        super.putConstructor(messageName, obj)
    }
}

/**
 * The global registry. It registers all infomation when a ts proto file is
 * imported. And it is used when decoding any message.
 */
export const GLOBAL_REGISTRY = new GlobalRegistry()
