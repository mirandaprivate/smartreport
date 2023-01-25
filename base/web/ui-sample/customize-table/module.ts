import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatMenuModule} from '@angular/material/menu'
import {MatSortModule} from '@angular/material/sort'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiCheckboxModule} from '@logi/base/web/ui/checkbox'
import {LogiTableModule} from '@logi/base/web/ui/customize-table'
import {LogiInputModule} from '@logi/base/web/ui/input'

import {LogiCustomizeTableSampleComponent} from './component'
import {ExpandTreeComponent} from './expand_tree.component'
import {NestedSampleComponent} from './nested_table.component'

@NgModule({
    bootstrap: [LogiCustomizeTableSampleComponent],
    declarations: [
        ExpandTreeComponent,
        LogiCustomizeTableSampleComponent,
        NestedSampleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        LogiButtonModule,
        LogiCheckboxModule,
        LogiInputModule,
        LogiTableModule,
        MatMenuModule,
        MatSortModule,
        ReactiveFormsModule,
    ],
})
export class LogiCustomizeTableSampleModule { }
