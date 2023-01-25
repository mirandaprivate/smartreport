import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-released-label',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ReleasedLabelComponent {
    public content = '发布版本'
}
