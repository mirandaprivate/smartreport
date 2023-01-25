import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core'
import {LogiMenuTriggerDirective} from '@logi/base/web/ui/menu'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-menu-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class MenuSampleComponent {
    public data = {
        id: 1,
        name: 'foo',
    }

    onMenuChange(): void {
        console.log(this._trigger.menuOpen)
    }

    @ViewChild('menu_trigger')
    private readonly _trigger!: LogiMenuTriggerDirective
}
