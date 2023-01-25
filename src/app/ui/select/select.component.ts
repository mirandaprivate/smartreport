// tslint:disable
import {BooleanInput} from '@angular/cdk/coercion'
import {SelectionModel} from '@angular/cdk/collections'
import {CdkOverlayOrigin} from '@angular/cdk/overlay'
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core'
import {isString} from '@logi/base/ts/common/type_guard'
import {Subscription} from 'rxjs'
import {getId, isArray} from './id'

import {
    LogiOptionComponent,
    LOGI_OPTION_PARENT_COMPONENT,
} from './option.component'
import {Label} from './selected_label.component'
export type ValueType = Label | Label[] | undefined

export class LogiSelectChange {
    public constructor(public source: LogiSelectComponent, public value: any) {}
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '(blur)': 'onBlur()',
        '[class.logi-select-disabled]': 'disabled',
        '[class.logi-select-multiple]': 'multiple',
        '[class.logi-select-single]': '!multiple',
        class: 'logi-select',
    },
    providers: [
        {
            provide: LOGI_OPTION_PARENT_COMPONENT,
            useExisting: LogiSelectComponent,
        },
    ],
    selector: 'logi-select',
    styleUrls: ['./select.style.css'],
    templateUrl: './select.template.html',
})
export class LogiSelectComponent extends Subscription implements OnInit,
OnDestroy, AfterViewInit {
    public constructor(
        private readonly _el: ElementRef<HTMLElement>,
        private readonly _cd: ChangeDetectorRef,
    ) {
        super()
    }
    public static ngAcceptInputType_disabled: BooleanInput
    public static ngAcceptInputType_searchable: BooleanInput
    public static ngAcceptInputType_noborder: BooleanInput

    @Output() public readonly valueChange$ = new EventEmitter<any>()
    @Output() readonly selectChange$ = new EventEmitter<LogiSelectChange>()
    @Output() public readonly closePanel$ = new EventEmitter<void>()
    @Output() readonly searchKeyChanged$ = new EventEmitter<string>()


    @Input() public disabled = false
    @Input() public searchable = false
    @Input() public value?: any
    @Input() noborder = false
    @Input() public labelContentTpl: TemplateRef<any> | null = null
    @Input() public customPanelClass = ''
    @Input() public fixedPanelWidth = 0
    @Input() public panelClass = ''
    @Input() public placeholder = '请选择'
    @Input() public emptyText = '无选项'
    @Input() public dropdownIcon = 'ic_arrow_down'
    @Input() public mode: 'default' | 'multiple' = 'default'
    @Input() transfer: (v: any) => Label = DEFAULT_TRANSFER

    public get multiple(): boolean {
        return this.mode === 'multiple'
    }
    selectedOptions: Label[] = []
    selectedOption?: Label

    public get empty(): boolean {
        return !this.selectionModel || this.selectionModel.isEmpty()
    }

    @ContentChildren(LogiOptionComponent, {descendants: true})
    public options!: QueryList<LogiOptionComponent>

    public panelOpen = false
    public triggerWidth = 120
    public selectionModel!: SelectionModel<Label>

    public ngOnInit(): void {
        this.selectionModel = new SelectionModel(this.multiple)
        this.add(this.selectionModel.changed.subscribe(() => {
            this.selectedOption = this.selectionModel.selected[0]
            this.selectedOptions = this.selectionModel.selected
            this._sortSelection()
            this._propagateChanges()
            this._cd.detectChanges()
        }))
    }

    public ngAfterViewInit(): void {
        this._setSelectionByValue()
        this._updatePanelStyle()
    }

    public ngOnDestroy(): void {
        this.unsubscribe()
    }

    public hasPanelActions(): boolean {
        if (!this._panelActionsRef)
            return false
        const element = this._panelActionsRef.nativeElement
        return element.children.length > 0
    }

    public togglePanel(): void {
        this.panelOpen ? this.closePanel() : this.openPanel()
    }

    public openPanel(): void {
        if (this.disabled || this.panelOpen)
            return
        this.panelOpen = true
        this._updatePanelStyle()
    }

    public onAttach(): void {
        const option = this.options.find(o => o.selected)
        if (option === undefined)
            return
        option.getHostElement().scrollIntoView()
    }

    public closePanel(): void {
        if (!this.panelOpen)
            return
        this.options.forEach(option => {
            option.hide = false
        })
        this.panelOpen = false
        this.closePanel$.next()
        this._cd.markForCheck()
    }

    public focus(): void {
        this._el.nativeElement.focus()
    }

    @ViewChild(CdkOverlayOrigin, {static: true, read: ElementRef})
    private readonly _originElement!: ElementRef<HTMLElement>

    @ViewChild('panel_actions')
    private readonly _panelActionsRef?: ElementRef<HTMLElement>

    private _updatePanelStyle(): void {
        const origin = this._originElement.nativeElement
        if (origin === undefined)
            return
        this.triggerWidth = this.fixedPanelWidth > 0 ?
            this.fixedPanelWidth :
            origin.getBoundingClientRect().width
    }

    private _propagateChanges(): void {
        const selected = this.multiple ? this.selectedOptions :
            this.selectedOption
        if (!selected)
            return
        const valueToEmit = isArray(selected) ? selected.map(s => s.value) :
            selected.value
        this.valueChange$.emit(valueToEmit)
        this.selectChange$.emit(new LogiSelectChange(this, valueToEmit))
        this._cd.markForCheck()
    }

    private _sortSelection(): void {
        if (!this.multiple)
            return
        const options = this.options.toArray()
        const indexOf = (l: Label) => options.findIndex(o => o.id === l.id)
        this.selectedOptions.sort((a, b) => indexOf(a) - indexOf(b))
    }

    private _setSelectionByValue() {
        this.selectionModel.clear()
        const value = this.value
        if (value === undefined)
            return

        if (isArray(value)) {
            if (!this.multiple)
                return
            value.forEach(v => this._selectValue(this.transfer(v)))
            this._sortSelection()
        } else
            this._selectValue(this.transfer(value))
        this._cd.markForCheck()
    }

    private _selectValue(value: Label): LogiOptionComponent | undefined {
        const option = this.options.find(o => o.id === value.id)
        option ? this.selectionModel.select(option) :
            this.selectionModel.select(value)
        return option
    }
}
const DEFAULT_TRANSFER = (value: any): Label => {
    if (isString(value))
        return {
            id: getId(),
            label: value,
            value: value,
        }
    return {
        id: value?.id ?? getId(),
        label: value?.label ?? '',
        value: value ?? null,
    }
}
