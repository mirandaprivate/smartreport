import {ChangeDetectionStrategy, Component} from '@angular/core'
import {ICONS} from '@logi/base/web/ui/icon/common_icons'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-icon-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class IconSampleComponent {
    public icons = ICONS.map(icon => icon.id)
}
