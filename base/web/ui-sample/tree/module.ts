import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiTreeModule} from '@logi/base/web/ui/tree'

import {TreeSampleComponent} from './component'

@NgModule({
    bootstrap: [TreeSampleComponent],
    declarations: [TreeSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiTreeModule,
        MatIconModule,
    ],
})
export class TreeSampleModule {}
