import {ChangeDetectionStrategy, Component, Injector} from '@angular/core'
import {TemplateBaseDirective} from './base.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-db-template-text',
    styleUrls: ['./db-common.component.scss', './db-template-text.component.scss'],
    templateUrl: './db-template-text.component.html',
})
export class DbTemplateTextComponent extends TemplateBaseDirective {
    public constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
}
