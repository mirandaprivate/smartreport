import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {MatTabsModule} from '@angular/material/tabs'
import {LogiButtonModule} from '@logi/base/web/ui/button'

import {CodeTabButtonComponent} from './button.component'
import {CodeRegionComponent} from './code_region'
import {CodeTabComponent} from './component'

@NgModule({
    declarations: [
        CodeRegionComponent,
        CodeTabButtonComponent,
        CodeTabComponent,
    ],
    exports: [
        CodeTabButtonComponent,
        CodeTabComponent,
    ],
    imports: [
        CommonModule,
        LogiButtonModule,
        MatIconModule,
        MatTabsModule,
    ],
})
export class CodeTabModule { }
