// tslint:disable: ext-variable-name variable-name
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion'
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core'
import {isArrayEqual} from '@logi/src/app/base/utils'
import {Subscription, timer} from 'rxjs'

import {CascadedSelectOption} from './option'
import {LogiCascadedSelectOptionComponent} from './option.component'
import {CascadedSelectService} from './service'

type LabelRenderFnType = (path: readonly CascadedSelectOption[]) => string

export interface CascadedSelectChange {
    /**
     * The path of selected option.
     */
    readonly options: readonly CascadedSelectOption[]
    /**
     * The final selected option. (it should be the last element of `options`)
     */
    readonly option: CascadedSelectOption
    /**
     * The index of final selected option
     */
    readonly index: number
}

// tslint:disable: no-empty unknown-instead-of-any no-null-keyword
// tslint:disable: unknown-instead-of-any
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line: use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        '(click)': 'onHostClick()',
        class: 'logi-cascaded-select',
    },
    providers: [CascadedSelectService],
    selector: 'logi-cascaded-select',
    styleUrls: ['./select.style.css'],
    templateUrl: './select.template.html',
})
export class LogiCascadedSelectComponent implements OnInit, OnDestroy {
    public constructor(
        private readonly _svc: CascadedSelectService,
        private readonly _cd: ChangeDetectorRef,
    ) {
    }
    public static ngAcceptInputType_disabled: BooleanInput
    public static ngAcceptInputType_searchable: BooleanInput

    @Input() public set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value)
    }

    public get disabled(): boolean {
        return this._disabled
    }

    @Input() public set options(options: readonly CascadedSelectOption[]) {
        this._svc.setOptions(options)
    }

    public get options(): readonly CascadedSelectOption[] {
        return this._svc.getColumns()[0]
    }

    @Input() public set value(value: readonly any[]) {
        if (isArrayEqual(value, this._value))
            return
        this._svc.setValues(value)
        this._svc.syngOptions()
        this._setDisplayLabel()
    }

    public get columns(): readonly (readonly CascadedSelectOption[])[] {
        return this._svc.getColumns()
    }

    @Input() public fixedLabel = ''
    @Input() public hideDropdownIcon = false

    @Output() public readonly change$ = new EventEmitter<CascadedSelectChange>()

    public shouldShowEmpty = false
    public menuVisible = false
    public labelRenderText = ''

    @Input() public set labelRenderFn(fn: LabelRenderFnType) {
        if (!fn || fn === this._labelRenderFn)
            return
        this._labelRenderFn = fn
        this._setDisplayLabel()
    }

    public get labelRenderFn(): LabelRenderFnType {
        return this._labelRenderFn
    }

    public ngOnInit(): void {
        if (this.fixedLabel.length)
            this.labelRenderText = this.fixedLabel
        this._subs.add(this._svc.listenRedraw().subscribe(() => {
            this._setDisplayLabel()
            this._cd.markForCheck()
        }))
        this._subs.add(this._svc.listOptionSelected().subscribe(event => {
            if (!event)
                return
            const shouldClose = event.option.isLeaf
            if (shouldClose)
                this.setMenuVisible(false)
            this.change$.emit({
                options: this._svc.getSelectedOptions(),
                ...event,
            })
            this._cd.markForCheck()
        }))
    }

    public ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    public onHostClick(): void {
        if (this.disabled)
            return
        this.setMenuVisible(!this.menuVisible)
    }

    public setMenuVisible(visible: boolean): void {
        if (this.disabled || this.menuVisible === visible)
            return
        if (visible)
            this._scrollToActivatedOptions()
        this.menuVisible = visible
        this._cd.markForCheck()
    }

    public isOptionActivated(
        option: CascadedSelectOption,
        index: number,
    ): boolean {
        const activeOpt = this._svc.getActivatedOptions()[index]
        return activeOpt === option
    }

    public onOptionClick(
        option: CascadedSelectOption,
        columnIndex: number,
        event: Event,
    ): void {
        if (event)
            event.preventDefault()
        if (option && option.disabled)
            return
        this._svc.setOptionActivated(option, columnIndex, true)
    }

    public closeMenu(): void {
        this.setMenuVisible(false)
    }

    @ViewChildren(LogiCascadedSelectOptionComponent)
    private _optionChildren!: QueryList<LogiCascadedSelectOptionComponent>
    private _subs = new Subscription()
    private _disabled = false
    private _value: readonly any[] = []
    private _labelRenderFn: LabelRenderFnType = defaultRenderLabel

    private _setDisplayLabel(): void {
        const selectedOptions = this._svc.getSelectedOptions()
        this.labelRenderText = this.fixedLabel.length ? this.fixedLabel :
            this.labelRenderFn.call(this, selectedOptions)
    }

    private _scrollToActivatedOptions(): void {
        timer().subscribe(() => {
            this._optionChildren.toArray().filter(e => e.activated).forEach(e =>
                e.hostElemnet.scrollIntoView({
                    block: 'start',
                    inline: 'nearest',
                }))
        })
    }
}

function defaultRenderLabel(
    optionPath: readonly CascadedSelectOption[],
): string {
    const labels: string[] = optionPath.map(o => o.label)
    return labels.join('/')
}
