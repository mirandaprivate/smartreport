import {ChangeDetectionStrategy, Component, Input} from '@angular/core'

import {Service} from './service'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-code-tab-button',
    styleUrls: [],
    // tslint:disable-next-line: template-i18n quotemark
    template: `
        <button logi-icon-button tooltip='查看代码' icon='ic_tab_doc' (click)='onClick($event)'>
        </button>
    `,
})
export class CodeTabButtonComponent {
    public constructor(private readonly _svc: Service) {}

    @Input() public codeId!: string

    public onClick(event: Event): void {
        if (this.codeId === undefined)
            return
        // @ts-ignore
        this._svc.openPanel(event.target, this.codeId)
    }
}
