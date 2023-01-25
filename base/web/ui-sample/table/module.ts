import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatSortModule} from '@angular/material/sort'
import {MatTableModule} from '@angular/material/table'
import {
    CommonUseModule,
} from '@logi/base/web/ui-sample/utils/common-use-modules'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiInputModule} from '@logi/base/web/ui/input'
import {LogiTableModule} from '@logi/base/web/ui/table'

import {TableSampleComponent} from './component'

@NgModule({
    bootstrap: [TableSampleComponent],
    declarations: [TableSampleComponent],
    imports: [
        CommonUseModule,
        FormsModule,
        LogiButtonModule,
        LogiInputModule,
        LogiTableModule,
        MatSortModule,
        MatTableModule,
    ],
})
export class TableSampleModule { }
