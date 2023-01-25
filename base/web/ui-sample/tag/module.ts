import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {LogiTagModule} from '@logi/base/web/ui/tag'

import {TagSampleComponent} from './component'

@NgModule({
    bootstrap: [TagSampleComponent],
    declarations: [TagSampleComponent],
    imports: [
        CommonModule,
        LogiTagModule,
    ],
})
export class TagSampleModule {}
