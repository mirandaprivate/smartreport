import {ChangeDetectionStrategy, Component, Injector} from '@angular/core'
import {BaseDirective} from './base.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-db-text',
    styleUrls: ['./db-common.component.scss', './db-text.component.scss'],
    templateUrl: './db-text.component.html',
})
export class DbTextComponent extends BaseDirective {
    public constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
}
