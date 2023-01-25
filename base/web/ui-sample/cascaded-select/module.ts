import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiCascadedSelectModule} from '@logi/base/web/ui/cascaded-select'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {CascadedSelectSampleComponent} from './component'

@NgModule({
    bootstrap: [CascadedSelectSampleComponent],
    declarations: [CascadedSelectSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiCascadedSelectModule,
        LogiSwitchModule,
        ReactiveFormsModule,
    ],
})
export class CascadedSelectSampleModule {}
