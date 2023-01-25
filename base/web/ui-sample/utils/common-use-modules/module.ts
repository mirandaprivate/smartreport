import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {CodeTabModule} from '@logi/base/web/ui-sample/utils/code-tab'

@NgModule({
    exports: [
        CodeTabModule,
        CommonModule,
        MatIconModule,
    ],
})
export class CommonUseModule {}
