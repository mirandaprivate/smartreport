import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatIconModule} from '@angular/material/icon'
import {LogiCheckboxModule} from '@logi/base/web/ui/checkbox'

import {CheckboxSampleComponent} from './component'

@NgModule({
    bootstrap: [CheckboxSampleComponent],
    declarations: [CheckboxSampleComponent],
    imports: [
        CommonModule,
        LogiCheckboxModule,
        MatCheckboxModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
})
export class CheckboxSampleModule {}
