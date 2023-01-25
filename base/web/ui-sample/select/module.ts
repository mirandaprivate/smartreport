import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {
    CommonUseModule,
} from '@logi/base/web/ui-sample/utils/common-use-modules'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiButtonToggleModule} from '@logi/base/web/ui/button-toggle'
import {LogiSelectModule} from '@logi/base/web/ui/select'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {SelectSampleComponent} from './component'

@NgModule({
    bootstrap: [SelectSampleComponent],
    declarations: [SelectSampleComponent],
    imports: [
        CommonModule,
        CommonUseModule,
        LogiButtonModule,
        LogiButtonToggleModule,
        LogiSelectModule,
        LogiSwitchModule,
        ReactiveFormsModule,
    ],
})
export class SelectSampleModule {}
