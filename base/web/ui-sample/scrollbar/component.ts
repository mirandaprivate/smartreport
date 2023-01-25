// tslint:disable: no-magic-numbers
import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-scrollbar-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ScrollbarSampleComponent {
    public disabled = false
}
