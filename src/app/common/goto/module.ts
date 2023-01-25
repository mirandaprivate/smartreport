import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {LogiButtonModule} from '@logi/src/app/ui/button'

import {GotoComponent} from './component'

@NgModule({
    declarations: [GotoComponent],
    exports: [GotoComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
    ],
})
export class GotoModule {}
