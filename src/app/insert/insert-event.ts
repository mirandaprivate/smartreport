import {Builder} from '@logi/base/ts/common/builder'
import {
    SeriesValue,
    PlaceHolderDesc,
    DataListTypeEnum,
} from '@logi-pb/src/proto/jianda/data_pb'
import {encode} from './placeholder'

export interface InsertEvent {
    readonly placeholderDesc: PlaceHolderDesc
    readonly value: SeriesValue
    readonly from: DataListTypeEnum
    getEncodedPlaceholderDesc(): string
}

class InsertEventImpl implements InsertEvent {
    public placeholderDesc!: PlaceHolderDesc
    public value!: SeriesValue
    public from!: DataListTypeEnum
    getEncodedPlaceholderDesc(): string {
        return encode(this.placeholderDesc)
    }
}

export class InsertEventBuilder extends Builder<InsertEvent, InsertEventImpl> {
    public constructor(obj?: Readonly<InsertEvent>) {
        const impl = new InsertEventImpl()
        if (obj)
            InsertEventBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public placeholderDesc(placeholderDesc: PlaceHolderDesc): this {
        this.getImpl().placeholderDesc = placeholderDesc
        return this
    }

    public value(value: SeriesValue): this {
        this.getImpl().value = value
        return this
    }

    public from(from: DataListTypeEnum): this {
        this.getImpl().from = from
        return this
    }

    protected get daa(): readonly string[] {
        return InsertEventBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'placeholderDesc',
        'value',
        'from',
    ]
}

export function isInsertEvent(value: unknown): value is InsertEvent {
    return value instanceof InsertEventImpl
}

export function assertIsInsertEvent(
    value: unknown
): asserts value is InsertEvent {
    if (!(value instanceof InsertEventImpl))
        throw Error('Not a InsertEvent!')
}
