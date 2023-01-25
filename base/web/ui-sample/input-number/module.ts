import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {LogiInputModule} from '@logi/base/web/ui/input'
import {LogiSliderModule} from '@logi/base/web/ui/slider'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {InputNumberSampleComponent} from './component'

@NgModule({
    bootstrap: [InputNumberSampleComponent],
    declarations: [InputNumberSampleComponent],
    imports: [
        CommonModule,
        LogiInputModule,
        LogiSliderModule,
        LogiSwitchModule,
        ReactiveFormsModule,
    ],
})
export class InputNumberSampleModule { }
