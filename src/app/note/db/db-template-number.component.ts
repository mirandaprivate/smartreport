import {ChangeDetectionStrategy, Component, Injector} from '@angular/core'
import {TemplateBaseDirective} from './base.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-db-template-number',
    styleUrls: ['./db-common.component.scss', './db-template-number.component.scss'],
    templateUrl: './db-template-number.component.html',
})
export class DbTemplateNumberComponent extends TemplateBaseDirective {
    public constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
}
