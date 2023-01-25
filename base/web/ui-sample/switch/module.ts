import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {SwitchSampleComponent} from './component'

@NgModule({
    bootstrap: [SwitchSampleComponent],
    declarations: [SwitchSampleComponent],
    imports: [
        CommonModule,
        LogiSwitchModule,
        ReactiveFormsModule,
    ],
})
export class SwitchSampleModule {}
