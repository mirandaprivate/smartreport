import {Builder} from '@logi/base/ts/common/builder'
import {Impl} from '@logi/base/ts/common/mapped_types'
export interface Argument {
    readonly arg: string
    readonly default: string
    readonly description: string
}

class ArgumentImpl implements Impl<Argument> {
    public arg!: string
    public default!: string
    public description!: string
}

export class ArgumentBuilder extends Builder<Argument, ArgumentImpl> {
    public constructor(obj?: Readonly<Argument>) {
        const impl = new ArgumentImpl()
        if (obj)
            ArgumentBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public arg(arg: string): this {
        this.getImpl().arg = arg
        return this
    }

    public default(v: string): this {
        this.getImpl().default = v
        return this
    }

    public description(description: string): this {
        this.getImpl().description = description
        return this
    }

    protected get daa(): readonly string[] {
        return ArgumentBuilder.__DAA_PROPS__
    }
}

export function isArgument(value: unknown): value is Argument {
    return value instanceof ArgumentImpl
}

export function assertIsArgument(value: unknown): asserts value is Argument {
    if (!(value instanceof ArgumentImpl))
        throw Error('Not a Argument!')
}
