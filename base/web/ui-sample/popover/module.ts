import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiPopoverModule} from '@logi/base/web/ui/popover'

import {PopoverSampleComponent} from './component'

@NgModule({
    bootstrap: [PopoverSampleComponent],
    declarations: [PopoverSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiPopoverModule,
        MatIconModule,
    ],
})
export class PopoverSampleModule {}
