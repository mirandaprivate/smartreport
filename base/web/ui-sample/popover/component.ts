import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core'
import {LogiPopoverTriggerDirective} from '@logi/base/web/ui/popover'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-popover-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class PopoverSampleComponent {
    onPanelChange(): void {
        console.log(this._trigger.panelOpen)
    }

    @ViewChild('popover_trigger')
    private readonly _trigger!: LogiPopoverTriggerDirective
}
