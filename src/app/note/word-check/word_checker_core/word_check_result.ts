import {Builder} from '@logi/base/ts/common/builder'
import {SensitiveWordLevelEnum} from '@logi-pb/src/proto/jianda/report_pb'

export interface CountedWord {
    readonly text: string
    readonly count: number
}

export interface TypedWordCheckResult {
    readonly type: SensitiveWordLevelEnum
    readonly words: readonly CountedWord[]
}

class TypedWordCheckResultImpl implements TypedWordCheckResult {
    public type!: SensitiveWordLevelEnum
    public words: readonly CountedWord[] = []
}

export class TypedWordCheckResultBuilder extends Builder<TypedWordCheckResult, TypedWordCheckResultImpl> {
    public constructor(obj?: Readonly<TypedWordCheckResult>) {
        const impl = new TypedWordCheckResultImpl()
        if (obj)
            TypedWordCheckResultBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public type(type: SensitiveWordLevelEnum): this {
        this.getImpl().type = type
        return this
    }

    public words(words: readonly CountedWord[]): this {
        this.getImpl().words = words
        return this
    }

    protected get daa(): readonly string[] {
        return TypedWordCheckResultBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'type',
    ]
}

export function isTypedWordCheckResult(
    value: unknown
): value is TypedWordCheckResult {
    return value instanceof TypedWordCheckResultImpl
}

export function assertIsTypedWordCheckResult(
    value: unknown
): asserts value is TypedWordCheckResult {
    if (!(value instanceof TypedWordCheckResultImpl))
        throw Error('Not a TypedWordCheckResult!')
}
