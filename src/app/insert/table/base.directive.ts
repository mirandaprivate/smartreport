// tslint:disable: no-input-prefix
import {
    HostBinding,
    QueryList,
    ElementRef,
    ViewChild,
    ViewChildren,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    OnDestroy,
    Directive,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    Injector,
} from '@angular/core'
import {SeriesValue} from '@logi-pb/src/proto/jianda/data_pb'
import {Item} from './item'
import {fromEvent, Subscription} from 'rxjs'
import {LogiScrollbarComponent} from '@logi/src/app/ui/scrollbar'

@Directive({
    selector: '[logi-table-base]',
})
export class TableBaseDirective implements OnChanges, AfterViewInit, OnDestroy {
    constructor(
        public readonly injector: Injector,
    ) {
        this.cd = injector.get(ChangeDetectorRef)
    }
    @Input() tableValues: readonly Item<SeriesValue>[] = []
    @Input() currValue?: Item<SeriesValue>
    @Input() lastestValue?: Item<SeriesValue>
    @Input() isRelative = false
    @HostBinding('class.time-series') @Input() isTimeSeries = false
    @Input() isTemplate = false
    @Output() readonly clickItem$ = new EventEmitter<Item<SeriesValue>>()
    @Output() readonly dbclickItem$ = new EventEmitter<Item<SeriesValue>>()
    cd: ChangeDetectorRef
    disableScrollLeftButton = true
    disableScrollRightButton = true
    ngOnChanges(changes: SimpleChanges): void {
        const {tableValues, currValue} = changes
        if (tableValues && !tableValues.isFirstChange())
            this.scroll()
        if (currValue && !currValue.isFirstChange())
            this._scrollIntoView()
    }

    ngAfterViewInit(): void {
        this.scroll()
    }

    ngOnDestroy(): void {
        this._scrollSub?.unsubscribe()
    }

    onItemClick(item: Item<SeriesValue>): void {
        this.clickItem$.next(item)
    }

    onDbClickItem(item: Item<SeriesValue>): void {
        this.dbclickItem$.next(item)
    }

    scroll(): void {
        this._scrollSub?.unsubscribe()
        this.cd.markForCheck()
        const scrollContainer = this._scrollContainer
        if (scrollContainer === undefined)
            return
        this.disableScrollLeftButton = scrollContainer.scrollLeft === 0
        this.disableScrollRightButton =
            scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth
        this._scrollSub = fromEvent(scrollContainer, 'scroll').subscribe(() => {
            this.disableScrollLeftButton = scrollContainer.scrollLeft === 0
            this.disableScrollRightButton =
                scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth
            this.cd.markForCheck()
        })
        this.cd.detectChanges()
        this._scrollIntoView()
    }

    onLeftScroll(): void {
        if (this.disableScrollLeftButton)
            return
        const scrollContainer = this._scrollContainer
        if (scrollContainer === undefined)
            return
        const delta = Math.min(20, scrollContainer.scrollLeft)
        scrollContainer.scrollLeft -= delta
    }

    onRightScroll(): void {
        if (this.disableScrollRightButton)
            return
        const scrollContainer = this._scrollContainer
        if (scrollContainer === undefined)
            return
        const scrollRight = scrollContainer.scrollWidth - scrollContainer.scrollLeft - scrollContainer.clientWidth
        const delta = Math.min(20, scrollRight)
        scrollContainer.scrollLeft += delta
    }
    @ViewChildren('cell')
    private _tds!: QueryList<ElementRef<HTMLTableDataCellElement>>
    @ViewChild(LogiScrollbarComponent)
    private _scrollbarComponent!: LogiScrollbarComponent
    private _scrollSub?: Subscription
    private get _scrollContainer(): HTMLElement | undefined {
        return this._scrollbarComponent.viewport
    }

    private _scrollIntoView(): void{
        if (this.currValue === undefined)
            return
        const index = this.tableValues.indexOf(this.currValue)
        if (index === -1)
            return
        const el = Array.from(this._tds)[index]
        if(el === undefined)
            return
        requestAnimationFrame(()=>{
            el.nativeElement.scrollIntoView({block: 'center'})
        })
    }
}
