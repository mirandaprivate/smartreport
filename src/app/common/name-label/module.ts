import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatTooltipModule} from '@angular/material/tooltip'
import {LogiTagModule} from '@logi/src/app/ui/tag'

import {NameLabelComponent} from './component'
import {UpdateUserInfoService} from './service'

@NgModule({
    declarations: [NameLabelComponent],
    exports: [NameLabelComponent],
    imports: [
        CommonModule,
        LogiTagModule,
        MatTooltipModule,
    ],
    providers: [UpdateUserInfoService],
})
export class NameLabelModule {}
