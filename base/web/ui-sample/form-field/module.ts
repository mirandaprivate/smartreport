import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiFormFieldModule} from '@logi/base/web/ui/form-field'
import {LogiInputModule} from '@logi/base/web/ui/input'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {FormFieldSampleComponent} from './component'

@NgModule({
    bootstrap: [FormFieldSampleComponent],
    declarations: [FormFieldSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiFormFieldModule,
        LogiInputModule,
        LogiSwitchModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
})
export class FormFieldSampleModule { }
