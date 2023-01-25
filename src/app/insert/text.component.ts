import {Component, ChangeDetectionStrategy, Injector} from '@angular/core'
import {LogiInsertBaseDirective} from './base.directive'
import {
    DataViewItemBuilder,
    DataViewItemId,
    freqPipe,
} from './series-value-desc'
import {Item} from './table'
import {formatDate} from '@logi/src/http/date'
import {
    SeriesValue,
    DataListTypeEnum,
} from '@logi-pb/src/proto/jianda/data_pb'

@Component({
    selector: 'logi-insert-text',
    templateUrl: './text.component.html',
    styleUrls: ['./insert-common.scss','./text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends LogiInsertBaseDirective {
    constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
    insertType = DataListTypeEnum.DATA_LIST_TYPE_TEXT
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
        const freqs = this.itemData.freqs
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
        this.seriesValueDescs = [absTime, freq]
        this.cd.detectChanges()
    }
}
