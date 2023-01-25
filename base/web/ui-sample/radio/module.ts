import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatIconModule} from '@angular/material/icon'
import {LogiRadioModule} from '@logi/base/web/ui/radio'

import {RadioSampleComponent} from './component'

@NgModule({
    bootstrap: [RadioSampleComponent],
    declarations: [RadioSampleComponent],
    imports: [
        CommonModule,
        LogiRadioModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
})
export class RadioSampleModule {}
