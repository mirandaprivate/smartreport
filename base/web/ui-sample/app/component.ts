import {ChangeDetectionStrategy, Component} from '@angular/core'
import {IconService} from '@logi/base/web/ui/icon'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.height]': '"100%"',
        '[style.width]': '"100%"',
    },
    selector: 'logi-app-component',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class AppComponent {
    public constructor(private readonly _iconSvc: IconService) {
        this._iconSvc.registerAllIconsWithoutPrefix()
    }
}
