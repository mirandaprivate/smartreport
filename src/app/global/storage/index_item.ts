import {Builder} from '@logi/base/ts/common/builder'

export interface IndexItem {
    readonly name: string  // index name
    readonly keyPath: string
    readonly paramters?: IDBIndexParameters
}

class IndexItemImpl implements IndexItem {
    public name!: string
    public keyPath!: string
    public paramters?: IDBIndexParameters
}

export class IndexItemBuilder extends Builder<IndexItem, IndexItemImpl> {
    public constructor(obj?: Readonly<IndexItem>) {
        const impl = new IndexItemImpl()
        if (obj)
            IndexItemBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public keyPath(keyPath: string): this {
        this.getImpl().keyPath = keyPath
        return this
    }

    public paramters(paramters: IDBIndexParameters): this {
        this.getImpl().paramters = paramters
        return this
    }

    protected get daa(): readonly string[] {
        return IndexItemBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'name',
        'keyPath',
    ]
}

export function isIndexItem(value: unknown): value is IndexItem {
    return value instanceof IndexItemImpl
}

export function assertIsIndexItem(value: unknown): asserts value is IndexItem {
    if (!(value instanceof IndexItemImpl))
        throw Error('Not a IndexItem!')
}
