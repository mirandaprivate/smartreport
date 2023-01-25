import {Builder} from '@logi/base/ts/common/builder'

export interface RouteNav {
    readonly name: string
    readonly path: string
    readonly disable: boolean
    readonly icon: string
    readonly customNav?: () => void
    updateDisable(disable: boolean): void
}

class RouteNavImpl implements RouteNav {
    public name!: string
    public path = ''
    public disable = false
    public icon = ''
    public customNav?: () => void

    public updateDisable(disable: boolean): void {
        this.disable = disable
    }
}

export class RouteNavBuilder extends Builder<RouteNav, RouteNavImpl> {
    public constructor(obj?: Readonly<RouteNav>) {
        const impl = new RouteNavImpl()
        if (obj)
            RouteNavBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public name(name: string): this {
        this.getImpl().name = name
        return this
    }

    public path(path: string): this {
        this.getImpl().path = path
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

    public cust(icon: string): this {
        this.getImpl().icon = icon
        return this
    }

    protected get daa(): readonly string[] {
        return RouteNavBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'name',
    ]
}

export function isNavItem(value: unknown): value is RouteNav {
    return value instanceof RouteNavImpl
}

export function assertIsNavItem(value: unknown): asserts value is RouteNav {
    if (!(value instanceof RouteNavImpl))
        throw Error('Not a RouteNav')
}
