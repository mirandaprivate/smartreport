import {
    Component,
    ViewChildren,
    QueryList,
    ChangeDetectionStrategy,
    Injector,
    ElementRef,
} from '@angular/core'
import {TableBaseDirective} from './base.directive'
import {TextMoreComponent, MoreData} from './more.component'
import {MatDialog} from '@angular/material/dialog'
import {Item} from './item'
import {SeriesValue} from '@logi-pb/src/proto/jianda/data_pb'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-text-table',
    templateUrl: './text-table.component.html',
    styleUrls: ['./common.component.scss', './text-table.component.scss'],
})
export class TextTableComponent extends TableBaseDirective {
    constructor(
        public readonly injector: Injector,
        private readonly _matDialog: MatDialog,
    ) {
        super(injector)
    }
    tdValues(item?: Item<SeriesValue>): readonly string[] {
        if (item === undefined)
            return ['']
        const value = item.bindingData.value
        if (value === undefined)
            return ['']
        if (!item.bindingData.newLine)
            return [value.getValue()?.[0].toString() ?? '']
        const values: string[] = []
        item.td.split('\n').forEach(t => {
            values.push(t)
        })
        return values
    }

    more(item: Item<SeriesValue>): void {
        const data: MoreData = {
            date: item.th ?? '',
            text: item.td,
        }
        this._matDialog.open(
            TextMoreComponent,
            {data, width: '540px', height: '70vh', hasBackdrop: true}
        )
    }

    hasMore(index: number): boolean {
        if (this._cells === undefined)
            return false
        const elf = this._cells.get(index)
        if (elf === undefined)
            return false
        const el = elf.nativeElement
        return el.scrollHeight > el.clientHeight
    }
    @ViewChildren('cell')
    private readonly _cells?: QueryList<ElementRef<HTMLDivElement>>
}
