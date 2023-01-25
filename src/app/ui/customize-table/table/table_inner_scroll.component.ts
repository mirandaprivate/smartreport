/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
// tslint:disable:ext-variable-name variable-name component-selector
// tslint:disable:codelyzer-template-property-should-be-public
// tslint:disable: no-inputs-metadata-property no-host-metadata-property
// tslint:disable: use-component-view-encapsulation
// tslint:disable: no-null-keyword
// tslint:disable: typedef
import {Platform} from '@angular/cdk/platform'
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling'
import {
    OnInit,
    ChangeDetectorRef,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    TrackByFunction,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core'
import {BehaviorSubject, fromEvent, merge, Subject} from 'rxjs'
import {
    skip,
    debounceTime,
    delay,
    filter,
    startWith,
    switchMap,
    takeUntil,
} from 'rxjs/operators'

import {LogiTableStyleService} from '../service/style.service'
import {LogiSafeAny, LogiTableData} from '../table.type'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'logi-table-inner-scroll',
    templateUrl: './table_inner_scroll.template.html',
})
export class LogiTableInnerScrollComponent implements
 OnChanges, AfterViewInit, OnDestroy, OnInit {
    // tslint:disable-next-line: max-func-body-length
    public constructor(
        private readonly renderer: Renderer2,
        private readonly ngZone: NgZone,
        private readonly platform: Platform,
        private readonly elementRef: ElementRef,
        private readonly styleSvc: LogiTableStyleService,
        private readonly _cd: ChangeDetectorRef,
    ) {
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('logi-table-container')
    }
    @Input() public noResult = ''
    @Input() public data: readonly LogiTableData[] = []
    @Input() public scrollX: string | null = null
    @Input() public scrollY: string | null = null
    @Input() public contentTemplate: TemplateRef<LogiSafeAny> | null = null
    @Input() public widthConfig: readonly string[] = []
    // tslint:disable-next-line: readonly-array
    @Input() public listOfColWidth: (string | null) [] = []
    @Input() public theadTemplate: TemplateRef<LogiSafeAny> | null = null
    @Input() public virtualTemplate: TemplateRef<LogiSafeAny> | null = null
    @Input() public virtualItemSize = 0
    @Input() public virtualMaxBufferPx = 200
    @Input() public virtualMinBufferPx = 100
    @Input() public tableMainElement?: HTMLDivElement
    @ViewChild(
        'tableheaderelement',
        {read: ElementRef},
    ) public tableHeaderElement!: ElementRef
    @ViewChild(
        'tablebodyelement',
        {read: ElementRef},
    ) public tableBodyElement!: ElementRef
    @ViewChild(CdkVirtualScrollViewport, {read: CdkVirtualScrollViewport})
    public cdkVirtualScrollViewport?: CdkVirtualScrollViewport
    public showEmpty$ = new BehaviorSubject<boolean>(false)
    public headerStyleMap = {}
    public bodyStyleMap = {}
    @Input() public verticalScrollBarWidth = 0
    public noDateVirtualHeight = '182px'
    @Input() public virtualForTrackBy: TrackByFunction<LogiTableData> =
        index => index

    public setScrollPositionClassName(clear = false): void {
        const {
            scrollWidth,
            scrollLeft,
            clientWidth,
        } = this.tableBodyElement.nativeElement
        const leftClassName = 'logi-table-ping-left'
        const rightClassName = 'logi-table-ping-right'
        const isRemaveRight = (scrollWidth - (scrollLeft + clientWidth)) < 1 &&
            (scrollWidth - (scrollLeft + clientWidth)) > -1
        if ((scrollWidth === clientWidth && scrollWidth !== 0) || clear) {
            this.renderer.removeClass(this.tableMainElement, leftClassName)
            this.renderer.removeClass(this.tableMainElement, rightClassName)
        } else if (scrollLeft === 0) {
            this.renderer.removeClass(this.tableMainElement, leftClassName)
            this.renderer.addClass(this.tableMainElement, rightClassName)
        } else if (isRemaveRight) {
            this.renderer.removeClass(this.tableMainElement, rightClassName)
            this.renderer.addClass(this.tableMainElement, leftClassName)
        } else {
            this.renderer.addClass(this.tableMainElement, leftClassName)
            this.renderer.addClass(this.tableMainElement, rightClassName)
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const {scrollX, scrollY, data} = changes
        if (scrollX || scrollY) {
            const hasVerticalScrollBar = this.verticalScrollBarWidth !== 0
            this.headerStyleMap = {
                overflowX: 'hidden',
                overflowY: this.scrollY && hasVerticalScrollBar ? 'scroll' : 'hidden',
            }
            this.bodyStyleMap = {
                overflowX: this.scrollX ? 'auto' : null,
                overflowY: this.scrollY ? 'auto' : 'hidden',
            }
            this.scroll$.next()
        }
        if (data)
            this.data$.next()
    }

    ngOnInit(): void {
        const showEmpty$ = this.styleSvc.showEmpty()
        showEmpty$.subscribe(s => {
            this._cd.markForCheck()
            this.showEmpty$.next(s)})
    }

    public ngAfterViewInit(): void {
        if (this.platform.isBrowser === undefined)
            return
        const scrollEvent$ = this.scroll$.pipe(
            startWith(null),
            delay(0),
            switchMap(() => fromEvent<MouseEvent>(
                this.tableBodyElement.nativeElement,
                'scroll',
            ).pipe(startWith(true))),
            takeUntil(this.destroy$),
        )
        this.ngZone.runOutsideAngular(() => {
            const data$ = this.data$.pipe(takeUntil(this.destroy$))
            const setClassName$ = merge(scrollEvent$, data$, this.scroll$)
                .pipe(startWith(true), delay(0), takeUntil(this.destroy$))
            setClassName$.subscribe(() => this.setScrollPositionClassName())
            scrollEvent$.pipe(filter(() => !!this.scrollY)).subscribe((
            ) => (this.tableHeaderElement.nativeElement.scrollLeft = this.tableBodyElement.nativeElement.scrollLeft),
            )
        })
        scrollEvent$
            .pipe(skip(1))
            .pipe(filter(()=>this.scrollY !== null),debounceTime(300))
            .subscribe(()=>{
                if(!this._isNearBottom(this.tableBodyElement.nativeElement))
                    return
                this.styleSvc.setScrollNearBottom()
            })
    }

    public ngOnDestroy(): void {
        this.setScrollPositionClassName(true)
        this.destroy$.next()
        this.destroy$.complete()
    }
    private data$ = new Subject<void>()
    private scroll$ = new Subject<void>()
    private destroy$ = new Subject<void>()
    private _isNearBottom(scrollContainer: HTMLElement): boolean{
        const position = scrollContainer.scrollTop + scrollContainer.offsetHeight
        return position >= scrollContainer.scrollHeight
    }

}
