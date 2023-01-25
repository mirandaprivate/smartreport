import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core'
import {Subject} from 'rxjs'
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators'

@Component({
    selector: 'tr[logi-table-measure-row]',
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './tr_measure.template.html',
})
export class LogiTrMeasureComponent implements AfterViewInit, OnDestroy {
    public constructor(
        private ngZone: NgZone, private elementRef: ElementRef) {
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('logi-table-measure-now')
    }
    @Input() public listOfMeasureColumn: readonly string[] = []
    @Output() public readonly listOfAutoWidth = new EventEmitter<readonly number[]>()
    @ViewChildren(
        'td_element',
    ) public listOfTdElement!: QueryList<ElementRef<HTMLElement>>
    public trackByFunc(_: number, key: string): string {
        return key
    }

    public ngAfterViewInit(): void {
        this.listOfTdElement.changes
            .pipe(startWith(this.listOfTdElement))
            .pipe(
                map(() => this.listOfTdElement
                    .toArray()
                    .map(item => item.nativeElement
                        .getBoundingClientRect().width),
                ),
                debounceTime(16),
                takeUntil(this._destroy$),
            )
            .subscribe(data => {
                this.ngZone.run(() => {
                    this.listOfAutoWidth.next(data)
                })
            })
    }

    public ngOnDestroy(): void {
        this._destroy$.next()
        this._destroy$.complete()
    }
    private _destroy$ = new Subject()
}
