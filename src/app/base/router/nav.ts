import {Builder} from '@logi/base/ts/common/builder'
import {Impl} from '@logi/base/ts/common/mapped_types'

export interface Nav {
    readonly name: string
    readonly type: string
    readonly disable: boolean
    readonly icon: string
    updateDisable(disable: boolean): void
}

class NavImpl implements Impl<Nav> {
    public name!: string
    public type!: string
    public disable = false
    public icon = ''
    public updateDisable(disable: boolean): void {
        this.disable = disable
    }
}

export class NavBuilder extends Builder<Nav, NavImpl> {
    public constructor(obj?: Readonly<Nav>) {
        const impl = new NavImpl()
        if (obj)
            NavBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public type(type: string): this {
        this.getImpl().type = type
        return this
    }

    public disable(disable: boolean): this {
        this.getImpl().disable = disable
        return this
    }

    public icon(icon: string): this {
        this.getImpl().icon = icon
        return this
    }

    protected get daa(): readonly string[] {
        return NavBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'name',
        'type',
    ]
}

export function isNav(value: unknown): value is Nav {
    return value instanceof NavImpl
}

export function assertIsNav(value: unknown): asserts value is Nav {
    if (!(value instanceof NavImpl))
        throw Error('Not a Nav!')
}
