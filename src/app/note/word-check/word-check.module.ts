import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatTooltipModule} from '@angular/material/tooltip'
import {WorkCheckComponent} from './word-check.component'
import {WorkCheckResultComponent} from './result.component'
import {GotoModule} from '@logi/src/app/common/goto'
import {LogiTagModule} from '@logi/src/app/ui/tag'
import {MatIconModule} from '@angular/material/icon'
import {LogiButtonModule} from '@logi/src/app/ui/button'

@NgModule({
    declarations: [
        WorkCheckComponent,
        WorkCheckResultComponent,
    ],
    exports: [WorkCheckComponent],
    imports: [
        MatIconModule,
        MatTooltipModule,
        LogiButtonModule,
        LogiTagModule,
        CommonModule,
        GotoModule,
    ],
})
export class WordCheckModule { }
