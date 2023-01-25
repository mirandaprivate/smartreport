/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {BooleanInput} from '@angular/cdk/coercion'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import {InputBoolean} from '@logi/src/app/ui/common/utils'
import {BehaviorSubject, Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'

import {LogiTableStyleService} from '../service/style.service'

@Component({
    selector: 'tr[logi-table-fixed-row], tr[logiExpand]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './table_fixed_row.template.html',
})
export class LogiTableFixedRowComponent implements OnInit, OnDestroy, AfterViewInit {
    public constructor(private logiTableStyleService: LogiTableStyleService, private renderer: Renderer2) {}
    public static ngAcceptInputType_logiNoIndent: BooleanInput
    @ViewChild('tdelement') public tdElement!: ElementRef
    @ViewChild('fixelement', {static: false}) public fixElement!: ElementRef

    @Input() @InputBoolean() public logiNoIndent = false

    public hostWidth$ = new BehaviorSubject<number | null>(null)
    public enableAutoMeasure$ = new BehaviorSubject<boolean>(false)
    public ngOnInit(): void {
        if (this.logiTableStyleService) {
            this.logiTableStyleService
                .enableAutoMeasure()
                .subscribe(this.enableAutoMeasure$)
            this.logiTableStyleService.hostWidth().subscribe((width) => {
                this.hostWidth$.next(!this.logiNoIndent ? width : null)
            })
        }
    }

    public ngAfterViewInit(): void {
        this.logiTableStyleService
            .columnCount()
            .pipe(takeUntil(this._destroy$))
            .subscribe(count => {
                this.renderer.setAttribute(
                    this.tdElement.nativeElement,
                    'colspan',
                    `${count}`,
                )
                this._setStyle()
            })
    }

    public ngOnDestroy(): void {
        this._destroy$.next()
        this._destroy$.complete()
    }
    private _destroy$ = new Subject()

    private _setStyle(): void {
        if (!this.logiNoIndent)
            return
        this.renderer.setStyle(this.tdElement.nativeElement, 'padding', `${0}`)
        if (this.fixElement !== undefined) {
            this.renderer
                .setStyle(this.fixElement.nativeElement, 'padding', `${0}`)
            this.renderer
                .setStyle(this.fixElement.nativeElement, 'margin', `${0}`)
        }
    }
}
