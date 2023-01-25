import {
    Input,
    Output,
    EventEmitter,
    Component,
    ChangeDetectionStrategy,
} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    @Input() readonly title: string = ''
    @Output() readonly close$ = new EventEmitter<void>()
}
