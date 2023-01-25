import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LogiButtonToggleModule} from '@logi/src/app/ui/button-toggle'
import {SourceNamesComponent} from './source-names.component'
import {LogiScrollbarModule} from '@logi/src/app/ui/scrollbar'

@NgModule({
    declarations: [SourceNamesComponent],
    exports: [SourceNamesComponent],
    imports: [
        CommonModule,
        LogiButtonToggleModule,
        LogiScrollbarModule,
    ],
})
export class SourceNamesModule {}
