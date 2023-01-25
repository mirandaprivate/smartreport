import {NgModule} from '@angular/core'
import {NumberTableComponent} from './number-table.component'
import {CommonModule} from '@angular/common'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {TextTableComponent} from './text-table.component'
import {TextMoreComponent} from './more.component'
import {MatDialogModule} from '@angular/material/dialog'
import {TableBaseDirective} from './base.directive'
import {LogiScrollbarModule} from '@logi/src/app/ui/scrollbar'

@NgModule({
    declarations: [
        NumberTableComponent,
        TableBaseDirective,
        TextMoreComponent,
        TextTableComponent,
    ],
    exports: [
        NumberTableComponent,
        TextMoreComponent,
        TextTableComponent,
    ],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiScrollbarModule,
        MatDialogModule,
    ],
})
export class TableModule {}
