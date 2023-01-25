import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {
    CommonUseModule,
} from '@logi/base/web/ui-sample/utils/common-use-modules'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiSliderModule} from '@logi/base/web/ui/slider'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {SliderSampleComponent} from './component'

@NgModule({
    bootstrap: [SliderSampleComponent],
    declarations: [SliderSampleComponent],
    imports: [
        CommonModule,
        CommonUseModule,
        LogiButtonModule,
        LogiSliderModule,
        LogiSwitchModule,
        ReactiveFormsModule,
    ],
})
export class SliderSampleModule {}
