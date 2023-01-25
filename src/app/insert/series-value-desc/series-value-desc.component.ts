import {
    Component,
    Input,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
} from '@angular/core'
import {DataViewItem, DataViewItemId} from './data-view-item'
import {ItemDataFreqEnum} from '@logi-pb/src/proto/jianda/data_pb'
import {InputNumberType} from '@logi/src/app/ui/input'
import {NotificationService} from '@logi/src/app/ui/notification'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-series-value-desc',
    templateUrl: './series-value-desc.component.html',
    styleUrls: ['./series-value-desc.component.scss'],
})
export class SeriesValueDescComponent {
    constructor(
        private readonly _notificationSvc: NotificationService,
    ) {}
    @Input() seriesValueDescs: readonly DataViewItem[] = []
    @Input() freq = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_UNSPECIEFIED
    @Output() readonly distanceChanged$ = new EventEmitter<readonly [value: string, index: number]>()
    @Output() readonly magnitudeChanged$ = new EventEmitter<readonly [value: string, index: number]>()
    dataViewItemId = DataViewItemId
    inputNumberType = InputNumberType.MULTI_DIVIDE
    onItemValueCopied(): void {
        this._notificationSvc.showInfo('已复制')
    }
}
