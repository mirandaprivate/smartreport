// tslint:disable: limit-indent-for-method-in-class
import {
    ChangeDetectorRef,
    EventEmitter,
    Directive,
    Input,
    Injector,
    Output,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {NotificationService} from '@logi/src/app/ui/notification'
import {Item, ItemBuilder} from './table'
import {
    DataListTypeEnum,
    CreatePlaceholderRequestBuilder,
    DataSeriesValueRequestBuilder,
    ItemDataDesc,
    PlaceHolderDesc,
    PlaceHolderDescBuilder,
    SeriesValue,
    SeriesValueBuilder,
    SeriesValueDescBuilder,
    ValueBuilder,
    _Value_Value,
} from '@logi-pb/src/proto/jianda/data_pb'
import {InsertEvent, InsertEventBuilder} from './insert-event'
import {
    DataViewItem,
    DataViewItemBuilder,
    DataViewItemId,
} from './series-value-desc'
import {Subscription} from 'rxjs'
import {createPlaceholder, dataSeriesValue} from '@logi/src/http/jianda'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {formatDate, getDate, getDateByDistance} from '@logi/src/http/date'
import {encode} from './placeholder'
class Services {
    constructor(
        public readonly injector: Injector,
    ) {
        this.notificationSvc = injector.get(NotificationService)
        this.http = injector.get(HttpClient)
    }
    notificationSvc: NotificationService
    http: HttpClient
}

@Directive({
    selector: '[logi-insert-base]',
})
export abstract class LogiInsertBaseDirective extends Services implements OnDestroy, AfterViewInit, OnChanges {
    constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
        this.cd = injector.get(ChangeDetectorRef)
    }

    @Input() projectId = ''
    @Input() insertType = DataListTypeEnum.DATA_LIST_TYPE_UNSPECIEFIED
    @Input() itemData!: ItemDataDesc
    @Output() readonly insert$ = new EventEmitter<InsertEvent>()
    cd: ChangeDetectorRef
    seriesValueDescs: readonly DataViewItem[] = []
    dataViewItemId = DataViewItemId
    loadingSeriesValue = true
    isTimeSeries = false
    tableValues: readonly Item<SeriesValue>[] = []
    currValue?: Item<SeriesValue>
    isRelative = false
    subs = new Subscription()
    ngOnChanges(changes: SimpleChanges): void {
        const {itemData} = changes
        if (itemData && !itemData.isFirstChange())
            this.initTableValues()
    }

    ngAfterViewInit(): void {
        this.initTableValues()
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe()
        this._dataSeriesValueSub?.unsubscribe()
    }

    onItemCopied(): void {
        this.notificationSvc.showInfo('已复制')
    }

    clickItem(item: Item<SeriesValue>): void {
        this.currValue = item
    }

    dblClickItem(item: Item<SeriesValue>): void {
        this.clickItem(item)
        this.onInsert()
    }

    onInsert(): void {
        const value = this.currValue?.bindingData
        if (!value)
            return
        const placeholderDesc = this.getPlaceholderDesc()
        if (placeholderDesc === undefined)
            return
        const event = new InsertEventBuilder()
            .placeholderDesc(placeholderDesc)
            .value(value)
            .from(this.insertType)
            .build()
        this.insert$.next(event)
    }

    updateSeriesValue(index: number, value: string): void {
        const old = this.seriesValueDescs[index]
        if (old === undefined)
            return
        const item = new DataViewItemBuilder(old).value(value).build()
        const descs = this.seriesValueDescs.slice()
        descs.splice(index, 1, item)
        this.seriesValueDescs = descs
    }

    empty(): void {
        this.tableValues = []
        this.seriesValueDescs = []
        this.currValue = undefined
    }

    // tslint:disable-next-line: max-func-body-length
    initTableValues(): void {
        this.cd.markForCheck()
        this._dataSeriesValueSub?.unsubscribe()
        this.empty()
        const itemData = this.itemData
        const req = new DataSeriesValueRequestBuilder()
            .researchId(this.projectId)
            .items([new SeriesValueDescBuilder()
                .id(itemData.id)
                .format(itemData.format[0])
                .build()])
            .dataType(this.insertType)
            .build()
        this._dataSeriesValueSub = dataSeriesValue(req, this.http)
            .subscribe(res => {
                this.cd.markForCheck()
                if (isHttpErrorResponse(res))
                    return
                const values = res.data?.value[0]
                if (values === undefined)
                    return
                this.isTimeSeries = values.isTimeseries
                this.isRelative = this.isTimeSeries
                const items = values.values.slice()
                if (this.isTimeSeries)
                    items.sort((a, b) => {
                        const dateA = getDate(a.date).getTime()
                        const dateB = getDate(b.date).getTime()
                        if (isNaN(dateA) || isNaN(dateB))
                            return 0
                        return dateA < dateB ? -1 : 0
                    })
                this.tableValues = items.map(v => {
                    const builder = new ItemBuilder<SeriesValue>()
                        .bindingData(v)
                    let value = ''
                    if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_NUMBER)
                        value = v.value?.d?.toFixed(2) ?? ''
                    else if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_TEXT)
                        value = v.value?.s ?? ''
                    const td = value
                    builder.td(td)
                    if (this.isTimeSeries)
                        builder.th(formatDate(v.date))
                    return builder.build()
                })
                this.cd.detectChanges()
                this.currValue = this.tableValues[this.tableValues.length - 1]
                this.setLastestValue()
                this.refSel()
            })
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLastestValue(): void {}

    abstract refSel(): void

    abstract onDescChanged(e: readonly [value: string, index: number]): void

    protected getPlaceholderDesc(): PlaceHolderDesc | undefined {
        const date = this.currValue?.bindingData.date
        if (date === undefined)
            return
        return new PlaceHolderDescBuilder()
            .dataType(this.itemData.dataType)
            .date(date)
            .format(this.itemData.format[0])
            .freq(this.itemData.freqs)
            .id(this.itemData.id)
            .isTimeseries(this.isTimeSeries)
            .name(this.itemData.name)
            .build()
    }
    private _dataSeriesValueSub?: Subscription

}

@Directive({selector: '[logi-insert-base-template]'})
export abstract class InsertBaseTemplateDirective extends LogiInsertBaseDirective implements OnDestroy {
    lastestValue?: Item<SeriesValue>
    setLastestValue(): void {
        this.lastestValue = this.tableValues[this.tableValues.length - 1]
    }

    empty(): void {
        this.tableValues = []
        this.seriesValueDescs = []
        this.currValue = undefined
        this.lastestValue = undefined
    }

    onButtonRadioSel(isRelative: boolean): void {
        this.isRelative = isRelative
        this.refSel()
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this._placeholderSub?.unsubscribe()
    }

    onDistanceChanged(e: readonly [value: string, index: number]): void {
        this.onDescChanged(e)
        if (this.lastestValue?.th === undefined)
            return
        const old = this.seriesValueDescs[e[1]]
        if (old === undefined)
            return
        const currDate = getDate(this.lastestValue.bindingData.date)
        const freq = this.itemData.freqs
        const target = getDateByDistance(currDate, Number(e[0]), freq)
        this.currValue = this.tableValues.find(v => {
            if (v.th === undefined)
                return
            return getDate(v.bindingData.date).getTime() === target.getTime()
        })
        if (this.currValue === undefined) {
            let value
            const v = new ValueBuilder()
            if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_NUMBER) {
                value = 0
                v.value(value, _Value_Value.D)
            } else if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_TEXT) {
                value = ''
                v.value(value, _Value_Value.S)
            } else if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_PICTURE) {
                value = ''
                v.value(value, _Value_Value.S)
            } else
                return
            this.currValue = new ItemBuilder<SeriesValue>()
                .th(formatDate(target.toString()))
                .td(value.toString())
                .bindingData(new SeriesValueBuilder()
                    .date(target.toString())
                    .value(v.build())
                    .build())
                .build()
        }
        this.cd.detectChanges()
    }

    protected getPlaceholderDesc(): PlaceHolderDesc | undefined {
        const desc = new PlaceHolderDescBuilder()
            .id(this.itemData.id)
            .name(this.itemData.name)
            .format(this.itemData.format[0])
            .isTimeseries(this.isTimeSeries)
            .freq(this.itemData.freqs)
            .dataType(this.itemData.dataType)
        const date = this.currValue?.bindingData.date
        if (date !== undefined)
            desc.date(date)
        const isDynamic = this.isRelative
        desc.isDynamic(isDynamic)
        if (isDynamic) {
            const item = this.seriesValueDescs
                .find(i => i.type === DataViewItemId.DISTANCE)
            if (item === undefined)
                // tslint:disable-next-line: no-throw-unless-asserts
                throw Error('not have distance item')
            desc.distance(Number(item.value))
        }
        if (this.insertType === DataListTypeEnum.DATA_LIST_TYPE_NUMBER) {
            const item = this.seriesValueDescs
                .find(i => i.type === DataViewItemId.MAGNITUDE)
            if (item === undefined)
                // tslint:disable-next-line: no-throw-unless-asserts
                throw Error('not have magnitude item')
            desc.magnitude(Number(item.value))
        }
        return desc.build()
    }

    protected updatePlaceholder(): void {
        this._placeholderSub?.unsubscribe()
        const index = this.seriesValueDescs
            .findIndex(i => i.type === DataViewItemId.PLACEHOLDER)
        if (index === -1)
            return
        const placeholderDesc = this.getPlaceholderDesc()
        if (placeholderDesc === undefined)
            return
        const text = encode(placeholderDesc)
        const req = new CreatePlaceholderRequestBuilder().text(text).build()
        this._placeholderSub = createPlaceholder(req, this.http)
            .subscribe(res => {
                this.cd.markForCheck()
                if (isHttpErrorResponse(res) || res.data === '')
                    return
                this.updateSeriesValue(index, `{{${res.data}}}`)
            })
    }

    private _placeholderSub?: Subscription
}
