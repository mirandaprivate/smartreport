import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatIconModule} from '@angular/material/icon'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatInputModule} from '@angular/material/input'
import {LogiButtonModule} from '@logi/src/app/ui/button'

import {LogiGroupInputComponent} from './group_input.component'
import {LogiInputDirective} from './input.directive'
import {LogiInputNumberComponent} from './input_number.component'
import {LogiActiveInputComponent} from './active_input.component'
import {LogiSelectInputComponent} from './select_input.component'
import {ActiveInputService} from './active_input.service'

@NgModule({
    declarations: [
        LogiActiveInputComponent,
        LogiGroupInputComponent,
        LogiInputDirective,
        LogiInputNumberComponent,
        LogiSelectInputComponent,
    ],
    exports: [
        LogiActiveInputComponent,
        LogiGroupInputComponent,
        LogiInputDirective,
        LogiInputNumberComponent,
        LogiSelectInputComponent,
    ],
    imports: [
        CommonModule,
        LogiButtonModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        ReactiveFormsModule,
    ],
    providers: [ActiveInputService],
})
export class LogiInputModule {}
