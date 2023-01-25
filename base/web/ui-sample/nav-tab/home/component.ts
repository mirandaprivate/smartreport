import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-home-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class HomeSampleComponent {}
