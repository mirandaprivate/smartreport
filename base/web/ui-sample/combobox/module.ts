import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MatDialogModule} from '@angular/material/dialog'
import {LogiButtonToggleModule} from '@logi/base/web/ui/button-toggle'
import {LogiComboboxModule} from '@logi/base/web/ui/combobox'
import {LogiSwitchModule} from '@logi/base/web/ui/switch'

import {ComboboxSampleComponent} from './component'

@NgModule({
    bootstrap: [ComboboxSampleComponent],
    declarations: [ComboboxSampleComponent],
    imports: [
        CommonModule,
        LogiButtonToggleModule,
        LogiComboboxModule,
        LogiSwitchModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
})
export class ComboboxSampleModule { }
