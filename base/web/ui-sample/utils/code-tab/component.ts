import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    InjectionToken,
    Input,
} from '@angular/core'
import {
    CodeTab,
    SAMPLE_CODES,
} from '@logi/base/web/ui-sample/_data/code_snippet'

import {Service} from './service'

export const CODE_TABS_PANEL_DATA = new InjectionToken<string>('CODE_TABS_PANEL_DATA')

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        class: 'logi-code-tab',
    },
    selector: 'logi-code-tab',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class CodeTabComponent {
    public constructor(

        @Inject(CODE_TABS_PANEL_DATA)
        private readonly _id: string,
        private readonly _svc: Service,
    ) {
        this.tabs = SAMPLE_CODES[this._id]
    }
    @Input() public tabs: readonly CodeTab[] = []

    public onClose(): void {
        this._svc.closePanel()
    }
}
