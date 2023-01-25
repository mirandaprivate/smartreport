import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {LogiScrollbarModule} from '@logi/base/web/ui/scrollbar'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {ScrollbarSampleComponent} from './component'

@NgModule({
    bootstrap: [ScrollbarSampleComponent],
    declarations: [ScrollbarSampleComponent],
    imports: [
        CommonModule,
        LogiScrollbarModule,
        LogiSwitchModule,
    ],
})
export class ScrollbarSampleModule { }
