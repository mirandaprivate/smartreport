import {ChangeDetectionStrategy, Component, Injector} from '@angular/core'
import {BaseDirective} from './base.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-db-number',
    styleUrls: ['./db-common.component.scss', './db-number.component.scss'],
    templateUrl: './db-number.component.html',
})
export class DbNumberComponent extends BaseDirective {
    public constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
}
