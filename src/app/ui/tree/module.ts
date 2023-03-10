import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatRippleModule} from '@angular/material/core'
import {MatIconModule} from '@angular/material/icon'
import {MatTreeModule} from '@angular/material/tree'
import {MatTooltipModule} from '@angular/material/tooltip'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {LogiCheckboxModule} from '@logi/src/app/ui/checkbox'
import {LogiInputModule} from '@logi/src/app/ui/input'
import {LogiRadioModule} from '@logi/src/app/ui/radio'

import {LogiTreeComponent} from './component'

@NgModule({
    declarations: [LogiTreeComponent],
    exports: [LogiTreeComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiCheckboxModule,
        LogiInputModule,
        LogiRadioModule,
        MatIconModule,
        MatRippleModule,
        MatTooltipModule,
        MatTreeModule,
    ],
})
export class LogiTreeModule {}
