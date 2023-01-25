import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-benchmark-label',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class BenchmarkLabelComponent {
    public content = '基准模型'
}
