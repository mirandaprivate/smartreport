import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatRippleModule} from '@angular/material/core'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatTooltipModule} from '@angular/material/tooltip'

import {LogiAnchorComponent, LogiButtonComponent} from './component'

@NgModule({
    declarations: [
        LogiAnchorComponent,
        LogiButtonComponent,
    ],
    exports: [
        LogiAnchorComponent,
        LogiButtonComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatTooltipModule,
    ],
})
export class LogiButtonModule {}
