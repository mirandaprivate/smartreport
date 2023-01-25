import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-people-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class PeopleSampleComponent {}
