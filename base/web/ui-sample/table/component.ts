// tslint:disable: no-unnecessary-method-declaration
// tslint:disable: no-console prefer-function-over-method no-magic-numbers
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core'
import {LogiTablePageChangeParams} from '@logi/base/web/ui/table'
import {timer} from 'rxjs'

interface Item {
    readonly name: string
    readonly position: number
    readonly weight: number
    readonly symbol: string
}

const ITEM_DATA: readonly Item[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
]

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-table-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class TableSampleComponent implements AfterViewInit {
    public constructor(private readonly _cd: ChangeDetectorRef) {}
    public data: readonly Item[] = ITEM_DATA
    public dataAsync: readonly Item[] = []
    public loading = false
    public total = ITEM_DATA.length
    public searchKey = ''
    // tslint:disable-next-line: codelyzer-template-property-should-be-public
    public dynamicData: readonly Item[] = []

    // tslint:disable: codelyzer-template-property-should-be-public
    public columns: readonly string[] = ['position', 'name', 'weight', 'symbol']
    public customCols: readonly string[] = ['name', 'weight', 'symbol']
    public sortCols: readonly string[] = ['name', 'weight']
    public singleSelectCols1: readonly string[] = ['position', 'name', 'weight', 'symbol']
    public singleSelectCols2: readonly string[] = ['name', 'weight', 'symbol']

    public ngAfterViewInit(): void {
        timer(2000).subscribe(() => {
            this.dynamicData = ITEM_DATA.filter(d => d.position < 5)
            this._cd.markForCheck()
        })
        timer(5000).subscribe(() => {
            this.dynamicData = ITEM_DATA.filter(d => d.position > 5)
            this._cd.markForCheck()
        })
    }

    public onInitDataForAsyn(): void {
        this.loading = true
        /**
         * You can replace timer with a http request.
         */
        timer(1000).subscribe(() => {
            this.dataAsync = [ITEM_DATA[0], ITEM_DATA[1]]
            this.loading = false
            this._cd.markForCheck()
        })
    }

    public onPageChange(params: LogiTablePageChangeParams): void {
        const pageSize = params.pageSize
        const pageIndex = params.pageIndex
        const start = (pageIndex) * pageSize
        const end = start + pageSize
        this.loading = true
        /**
         * You can replace timer with a http request.
         */
        timer(1000).subscribe(() => {
            const data = ITEM_DATA
            this.dataAsync = data.slice(start, end)
            this.loading = false
            this._cd.markForCheck()
        })
    }

    public isSelected(item: Item): boolean {
        return item === this._selected
    }

    public click(item: Item): void {
        if (this._selected === item)
            return
        this._selected = item
    }

    public onClickRow(item: Item): void {
        console.log(item)
    }

    public onSelectChange(items: readonly Item[]): void {
        console.log(items)
    }

    private _selected: Item | undefined = this.data.find(d => d.position === 4)
}
