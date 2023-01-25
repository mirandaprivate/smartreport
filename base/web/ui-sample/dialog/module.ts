import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatDialogModule} from '@angular/material/dialog'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiDialogModule} from '@logi/base/web/ui/dialog'
import {LogiFormFieldModule} from '@logi/base/web/ui/form-field'
import {LogiInputModule} from '@logi/base/web/ui/input'

import {DialogSampleComponent} from './component'
import {FormDialogSampleComponent} from './form_dialog.component'

@NgModule({
    bootstrap: [DialogSampleComponent],
    declarations: [DialogSampleComponent, FormDialogSampleComponent],
    imports: [
        LogiButtonModule,
        LogiDialogModule,
        LogiFormFieldModule,
        LogiInputModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
})
export class DialogSampleModule { }
