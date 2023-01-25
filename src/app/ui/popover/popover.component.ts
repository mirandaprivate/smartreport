import {
    ChangeDetectionStrategy,
    Component,
    Input,
    TemplateRef,
    ViewChild,
} from '@angular/core'

import {
    LogiPopoverPanel,
    PopoverPositionX,
    PopoverPositionY,
} from './popover_panel'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'logiPopover',
    selector: 'logi-popover',
    styleUrls: ['./popover.style.scss'],
    templateUrl: './popover.template.html',
})
export class LogiPopoverComponent implements LogiPopoverPanel {
    @Input() public positionX?: PopoverPositionX
    @Input() public positionY?: PopoverPositionY

    @ViewChild(TemplateRef, {static: true})
     public readonly templateRef!: TemplateRef<unknown>
}
