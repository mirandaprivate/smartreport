import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatRippleModule} from '@angular/material/core'
import {MatIconModule} from '@angular/material/icon'
import {ReadonlyInputModule} from '@logi/src/app/common/readonly-input'
import {LogiButtonModule} from '@logi/src/app/ui/button'

import {LogiTagComponent} from './component'

@NgModule({
    declarations: [LogiTagComponent],
    exports: [LogiTagComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        MatIconModule,
        MatRippleModule,
        ReadonlyInputModule,
    ],
})
export class LogiTagModule {}
