// tslint:disable: limit-indent-for-method-in-class
import {Component, ChangeDetectionStrategy, Injector} from '@angular/core'
import {LogiInsertBaseDirective} from './base.directive'
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
import {formatDate} from '@logi/src/http/date'

@Component({
    selector: 'logi-insert-number',
    templateUrl: './number.component.html',
    styleUrls: ['./insert-common.scss','./number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberComponent extends LogiInsertBaseDirective {
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
        const dataIndex = this.seriesValueDescs
            .findIndex(i => i.type === DataViewItemId.ABS_DATA)
        if (dataIndex !== -1) {
            const v = item.td
            this.updateSeriesValue(dataIndex, v)
        }
    }

    onDescChanged(e: readonly [value: string, index: number]): void {
        this.updateSeriesValue(e[1], e[0])
    }

    refSel(): void {
        // tslint:disable-next-line: max-func-body-length
        const freqs = this.itemData.freqs
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
        const data = new DataViewItemBuilder()
            .key('数据')
            .value(this.currValue?.td ?? '')
            .type(DataViewItemId.ABS_DATA)
            .build()
        if (this.isTimeSeries)
            this.seriesValueDescs = [absTime, unit, data, freq]
        else
            this.seriesValueDescs = [data, freq]
        this.cd.detectChanges()
    }
}
