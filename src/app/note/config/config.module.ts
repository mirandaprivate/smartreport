import {NgModule} from '@angular/core'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {CommonModule} from '@angular/common'
import {ConfigComponent} from './config.component'
import {TemplateComponent} from './template.component'
import {HeaderModule} from '@logi/src/app/header'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {LogiInputModule} from '@logi/src/app/ui/input'
import {LogiFormFieldModule} from '@logi/src/app/ui/form-field'
import {LogiSelectModule} from '@logi/src/app/ui/select'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {LogiRadioModule} from '@logi/src/app/ui/radio'
import {PermPipe} from './perm.pipe'

@NgModule({
    declarations: [
        ConfigComponent,
        PermPipe,
        TemplateComponent,
    ],
    exports: [
        ConfigComponent,
        TemplateComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        LogiButtonModule,
        LogiFormFieldModule,
        LogiInputModule,
        LogiRadioModule,
        LogiSelectModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
    ],
})
export class ConfigModule { }
