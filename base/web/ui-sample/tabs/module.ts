import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {LogiRadioModule} from '@logi/base/web/ui/radio'
import {LogiSelectModule} from '@logi/base/web/ui/select'
import {LogiTabsModule} from '@logi/base/web/ui/tabs'

import {TabsSampleComponent} from './component'

@NgModule({
    bootstrap: [TabsSampleComponent],
    declarations: [TabsSampleComponent],
    imports: [
        CommonModule,
        LogiRadioModule,
        LogiSelectModule,
        LogiTabsModule,
        MatIconModule,
    ],
})
export class TabsSampleModule {}
