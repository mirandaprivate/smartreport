import {BooleanInput} from '@angular/cdk/coercion'
import {
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Inject,
    InjectionToken,
    Input,
    OnDestroy,
    Optional,
    ViewEncapsulation,
} from '@angular/core'
import {getId} from './id'
import {Label} from './selected_label.component'
import {LogiSelectComponent} from './select.component'
import {Subscription} from 'rxjs'

interface OptionParentComponent {
    readonly disableRipple?: boolean
    readonly multiple?: boolean
}

export const LOGI_OPTION_PARENT_COMPONENT =
    new InjectionToken<OptionParentComponent>('MAT_OPTION_PARENT_COMPONENT')

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line: use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        '[class.logi-option-disabled]': 'disabled',
        '[class.logi-selected]': 'selected',
        '[style.display]': 'hide ? "none" : "flex"',
        class: 'logi-option',
    },
    selector: 'logi-option',
    styleUrls: ['./option.style.css'],
    templateUrl: './option.template.html',
})
export class LogiOptionComponent implements Label, OnInit, OnDestroy {
    public constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _el: ElementRef<HTMLElement>,
        @Optional() @Inject(LOGI_OPTION_PARENT_COMPONENT)
        private readonly _parent: OptionParentComponent,
        private readonly _selectComponent: LogiSelectComponent,
    ) {}
    // tslint:disable-next-line: ext-variable-name variable-name
    public static ngAcceptInputType_disabled: BooleanInput

    @Input() disabled = false

    public selected = false

    public get disableRipple(): boolean {
        // tslint:disable-next-line: no-double-negation
        return this._parent && !!this._parent.disableRipple
    }

    public get multiple(): boolean {
        // tslint:disable-next-line: no-double-negation
        return this._parent && !!this._parent.multiple
    }

    // tslint:disable-next-line: unknown-instead-of-any
    @Input() public value: any
    @Input() label = ''
    @Input() id = getId()

    public hide = false

    @HostListener('click')
    public selectByInteraction(): void {
        if (this.disabled)
            return
        this.selected = this.multiple ? !this.selected : true
        this._cd.markForCheck()
        const sel = this._selectComponent.selectionModel
        const option = sel.selected.find(op => op.id === this.id)
        option ? sel.deselect(option) : sel.select(this)
    }

    ngOnInit() {
        const sel = this._selectComponent.selectionModel
        const isSelected = sel.selected.find(s => s.id === this.id)
        this.selected = isSelected !== undefined
        this._subs.add(sel.changed.subscribe(() => {
            const isSelected = sel.selected.find(s => s.id === this.id)
            this.selected = isSelected !== undefined
            this._cd.detectChanges()
        }))
    }

    ngOnDestroy() {
        this._subs.unsubscribe()
    }

    public getHostElement(): HTMLElement {
        return this._el.nativeElement
    }

    private _subs = new Subscription()
}
