import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatDividerModule} from '@angular/material/divider'
import {MatMenuModule} from '@angular/material/menu'
import {
    CommonUseModule,
} from '@logi/base/web/ui-sample/utils/common-use-modules'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiMenuModule} from '@logi/base/web/ui/menu'

import {MenuSampleComponent} from './component'

@NgModule({
    bootstrap: [MenuSampleComponent],
    declarations: [MenuSampleComponent],
    imports: [
        CommonModule,
        CommonUseModule,
        LogiButtonModule,
        LogiMenuModule,
        MatDividerModule,
        MatMenuModule,
    ],
})
export class MenuSampleModule {}
