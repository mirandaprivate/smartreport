// tslint:disable: no-input-prefix
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-ref-type',
    templateUrl: './ref-type.component.html',
    styleUrls: ['./ref-type.component.scss'],
})
export class RefTypeComponent {
    @Input() isRelative = false
    @Input() isTimeSeries = false
    @Output() readonly isRelative$ = new EventEmitter<boolean>()
}
