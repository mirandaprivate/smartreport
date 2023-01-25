import {Builder} from '@logi/base/ts/common/builder'
import {Subject, Observable} from 'rxjs'
export enum DataViewItemId {
    UNIT,
    FREQ,
    MAGNITUDE,
    PLACEHOLDER,
    ABS_TIME,
    DISTANCE,
    ABS_DATA,
}
export interface DataViewItem {
    readonly key: string
    readonly value: string
    readonly type: DataViewItemId
    readonly valueChanged$: Observable<string>
    updateValue(value: string): void
    getNum(): number
}

class DataViewItemImpl implements DataViewItem {
    public key!: string
    public value!: string
    public type!: DataViewItemId
    valueChanged$ = new Subject<string>()

    public updateValue(value: string): void {
        this.value = value
        this.valueChanged$.next(value)
    }

    public getNum(): number {
        return Number(this.value)
    }
}

export class DataViewItemBuilder extends Builder<DataViewItem, DataViewItemImpl> {
    public constructor(obj?: Readonly<DataViewItem>) {
        const impl = new DataViewItemImpl()
        if (obj)
            DataViewItemBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public key(key: string): this {
        this.getImpl().key = key
        return this
    }

    public value(value: string): this {
        this.getImpl().value = value
        return this
    }

    public type(type: DataViewItemId): this {
        this.getImpl().type = type
        return this
    }

    protected get daa(): readonly string[] {
        return DataViewItemBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'key',
        'value',
        'type',
    ]
}

export function isDataViewItem(value: unknown): value is DataViewItem {
    return value instanceof DataViewItemImpl
}

export function assertIsDataViewItem(
    value: unknown
): asserts value is DataViewItem {
    if (!(value instanceof DataViewItemImpl))
        throw Error('Not a DataViewItem!')
}
