import {Builder} from '@logi/base/ts/common/builder'

import {IndexItem} from './index_item'

export interface ObjectStoreMeta {
    readonly name: string
    readonly parameters?: IDBObjectStoreParameters
    readonly indexItems: readonly IndexItem[]
}

class ObjectStoreMetaImpl implements ObjectStoreMeta {
    public name!: string
    public parameters?: IDBObjectStoreParameters
    public indexItems: readonly IndexItem[] = []
}

export class ObjectStoreMetaBuilder extends Builder<ObjectStoreMeta, ObjectStoreMetaImpl> {
    public constructor(obj?: Readonly<ObjectStoreMeta>) {
        const impl = new ObjectStoreMetaImpl()
        if (obj)
            ObjectStoreMetaBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public parameters(parameters: IDBObjectStoreParameters): this {
        this.getImpl().parameters = parameters
        return this
    }

    public indexItems(indexItems: readonly IndexItem[]): this {
        this.getImpl().indexItems = indexItems
        return this
    }

    protected get daa(): readonly string[] {
        return ObjectStoreMetaBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'name',
    ]
}

export function isObjectStoreMeta(value: unknown): value is ObjectStoreMeta {
    return value instanceof ObjectStoreMetaImpl
}

export function assertIsObjectStoreMeta(
    value: unknown,
): asserts value is ObjectStoreMeta {
    if (!(value instanceof ObjectStoreMetaImpl))
        throw Error('Not a ObjectStoreMeta!')
}
