import {OverlayModule} from '@angular/cdk/overlay'
import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import {MatRippleModule} from '@angular/material/core'
import {MatIconModule} from '@angular/material/icon'
import {MatTooltipModule} from '@angular/material/tooltip'
import {LogiInputModule} from '@logi/src/app/ui/input'

import {LogiOptionComponent} from './option.component'
import {LogiOptionGroupComponent} from './option_group.component'
import {LogiSelectPanelActionsDirective} from './panel_actions.directive'
import {LogiSelectComponent} from './select.component'
import {LogiSelectedLabelComponent} from './selected_label.component'
import {LogiSelectSearchComponent} from './search.component'

@NgModule({
    declarations: [
        LogiOptionComponent,
        LogiOptionGroupComponent,
        LogiSelectComponent,
        LogiSelectPanelActionsDirective,
        LogiSelectSearchComponent,
        LogiSelectedLabelComponent,
    ],
    exports: [
        LogiOptionComponent,
        LogiOptionGroupComponent,
        LogiSelectComponent,
        LogiSelectPanelActionsDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        LogiInputModule,
        MatIconModule,
        MatRippleModule,
        MatTooltipModule,
        OverlayModule,
        ReactiveFormsModule,
    ],
})
export class LogiSelectModule {}
