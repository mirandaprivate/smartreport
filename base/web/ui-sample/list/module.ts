import {ScrollingModule} from '@angular/cdk/scrolling'
import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {LogiListModule} from '@logi/base/web/ui/list'

import {ListSampleComponent} from './component'

@NgModule({
    bootstrap: [ListSampleComponent],
    declarations: [ListSampleComponent],
    imports: [
        CommonModule,
        LogiListModule,
        ScrollingModule,
    ],
})
export class ListSampleModule { }
