// tslint:disable: limit-indent-for-method-in-class
import {Component, ChangeDetectionStrategy, Injector} from '@angular/core'
import {InsertBaseTemplateDirective} from './base.directive'
import {
    DataViewItemBuilder,
    DataViewItemId,
    freqPipe,
} from './series-value-desc'
import {
    SeriesValue,
    DataListTypeEnum,
} from '@logi-pb/src/proto/jianda/data_pb'
import {Item} from './table'
import {formatDate, getDate, getDistanceByDates} from '@logi/src/http/date'

@Component({
    selector: 'logi-insert-number-template',
    templateUrl: './number-template.component.html',
    styleUrls: ['./insert-common.scss','./number-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberTemplateComponent extends InsertBaseTemplateDirective {
    constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
    insertType = DataListTypeEnum.DATA_LIST_TYPE_NUMBER
    clickItem(item: Item<SeriesValue>): void {
        super.clickItem(item)
        const absTimeIndex = this.seriesValueDescs
            .findIndex(i => i.type === DataViewItemId.ABS_TIME)
        if (absTimeIndex !== -1) {
            const v = formatDate(item.bindingData.date)
            this.updateSeriesValue(absTimeIndex, v)
        }
        const distanceIndex = this.seriesValueDescs
            .findIndex(i => i.type === DataViewItemId.DISTANCE)
        if (distanceIndex !== -1 && this.lastestValue !== undefined) {
            const curr = getDate(this.lastestValue.bindingData.date)
            const selected = getDate(item.bindingData.date)
            const freq = this.itemData.freqs
            const v = getDistanceByDates(curr, selected, freq)
            this.updateSeriesValue(distanceIndex, v.toString())
        }
        this.updatePlaceholder()
    }

    onDescChanged(e: readonly [value: string, index: number]): void {
        this.updateSeriesValue(e[1], e[0])
        this.updatePlaceholder()
    }

    refSel(): void {
        // tslint:disable-next-line: max-func-body-length
        let distanceValue = 0
        const freqs = this.itemData.freqs
        if (this.currValue && this.lastestValue) {
            const curr = getDate(this.lastestValue.bindingData.date)
            const selected = getDate(this.currValue.bindingData.date)
            distanceValue = getDistanceByDates(curr, selected, freqs)
        }
        const distance = new DataViewItemBuilder()
            .key('所选时间描述')
            .value(distanceValue.toString())
            .type(DataViewItemId.DISTANCE)
            .build()
        const magnitude = new DataViewItemBuilder()
            .key('数量级换算')
            .value('1')
            .type(DataViewItemId.MAGNITUDE)
            .build()
        const unit = new DataViewItemBuilder()
            .key('单位')
            .value(this.itemData.format[0])
            .type(DataViewItemId.UNIT)
            .build()
        const freq = new DataViewItemBuilder()
            .key('频率')
            .value(freqPipe(freqs))
            .type(DataViewItemId.FREQ)
            .build()
        const absTime = new DataViewItemBuilder()
            .key('时间')
            .value(this.currValue?.th ?? '')
            .type(DataViewItemId.ABS_TIME)
            .build()
        const items = []
        if (this.isTimeSeries && !this.isRelative)
            items.push(absTime)
        if (!this.isRelative)
            items.push(unit, magnitude)
        else
            items.push(distance, unit, magnitude)
        if (this.isTimeSeries)
            items.push(freq)
        const placeholder = new DataViewItemBuilder()
            .key('占位符')
            .value('')
            .type(DataViewItemId.PLACEHOLDER)
            .build()
        items.push(placeholder)
        this.seriesValueDescs = items
        this.updatePlaceholder()
        this.cd.detectChanges()
    }
}
