import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-source-file-label',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class SourceFileComponent {
    public content = '源文件'
}
