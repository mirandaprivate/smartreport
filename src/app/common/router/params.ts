import {Builder} from '@logi/base/ts/common/builder'

export interface LogiParams {
    readonly pageIndex?: number,
    readonly pageSize?: number,
    readonly search?: string,
    readonly total?: number
}

class LogiParamsImpl implements LogiParams {
    public pageIndex?: number
    public pageSize?: number
    public search?: string
    public total?: number
}

export class LogiParamsBuilder extends Builder<LogiParams, LogiParamsImpl> {
    public constructor(obj?: Readonly<LogiParams>) {
        const impl = new LogiParamsImpl()
        if (obj)
            LogiParamsBuilder.shallowCopy(impl, obj)
        super(impl)
    }
    public total(total: number): this {
        this.getImpl().total = total
        return this
    }

    public pageIndex(pageIndex: number): this {
        this.getImpl().pageIndex = pageIndex
        return this
    }

    public pageSize(pageSize: number): this {
        this.getImpl().pageSize = pageSize
        return this
    }

    public search(search: string): this {
        this.getImpl().search = search
        return this
    }
}

export function isLogiParams(value: unknown): value is LogiParams {
    return value instanceof LogiParamsImpl
}

export function assertIsLogiParams(
    value: unknown
): asserts value is LogiParams {
    if (!(value instanceof LogiParamsImpl))
        throw Error('Not a LogiParams!')
}
