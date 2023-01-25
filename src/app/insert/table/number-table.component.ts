import {Injector, Component, ChangeDetectionStrategy} from '@angular/core'
import {TableBaseDirective} from './base.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-number-table',
    templateUrl: './number-table.component.html',
    styleUrls: ['./common.component.scss','./number-table.component.scss'],
})
export class NumberTableComponent extends TableBaseDirective {
    constructor(
        public readonly injector: Injector,
    ) {
        super(injector)
    }
}
