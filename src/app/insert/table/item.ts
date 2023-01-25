import {Builder} from '@logi/base/ts/common/builder'
export interface Item<T> {
    readonly th?: string
    readonly td: string
    readonly bindingData: T
}

class ItemImpl<T> implements Item<T> {
    public th?: string
    public td = ''
    public bindingData!: T
}

export class ItemBuilder<T> extends Builder<Item<T>, ItemImpl<T>> {
    public constructor(obj?: Readonly<Item<T>>) {
        const impl = new ItemImpl<T>()
        if (obj)
            ItemBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public th(th: string): this {
        this.getImpl().th = th
        return this
    }

    public td(td: string): this {
        this.getImpl().td = td
        return this
    }

    public bindingData(bindingData: T): this {
        this.getImpl().bindingData = bindingData
        return this
    }

    protected get daa(): readonly string[] {
        return ItemBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'td',
        'bindingData',
    ]
}

export function isItem<T>(value: unknown): value is Item<T> {
    return value instanceof ItemImpl
}

export function assertIsItem<T>(value: unknown): asserts value is Item<T> {
    if (!(value instanceof ItemImpl))
        throw Error('Not a Item!')
}
