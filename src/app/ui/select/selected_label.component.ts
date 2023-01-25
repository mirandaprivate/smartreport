import {
    ChangeDetectionStrategy,
    Component,
    Input,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core'
import {LogiSelectComponent} from './select.component'

export interface Label {
    readonly id: string
    readonly label: string
    readonly value: any
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line: use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        '[class.deletable]': 'deletable',
        '[class.logi-selected-label-disabled]': 'disabled',
        class: 'logi-selected-label',
    },
    selector: 'logi-selected-label',
    styleUrls: ['./selected_label.style.css'],
    templateUrl: './selected_label.template.html',
})
export class LogiSelectedLabelComponent {
    constructor(
        private readonly _selectComponent: LogiSelectComponent,
    ) {}
    @Input() public id!: string
    @Input() public deletable = false
    @Input() public content = ''
    @Input() public disabled = false
    // tslint:disable: no-null-keyword unknown-instead-of-any
    @Input() public labelContentTpl: TemplateRef<any> | null = null
    @Input() public labelContentTplContext: any | null = null

    public onDelete(event: Event): void {
        if (this.disabled)
            return
        event.stopPropagation()
        const sel = this._selectComponent.selectionModel
        const option = sel.selected.find(op => op.id === this.id)
        if (option)
            this._selectComponent.selectionModel.deselect(option)
    }
}
