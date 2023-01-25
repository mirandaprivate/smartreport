import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {SpinnerModule} from '@logi/base/web/ui/spinner'

import {SpinnerSampleComponent} from './component'

@NgModule({
    bootstrap: [SpinnerSampleComponent],
    declarations: [SpinnerSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        SpinnerModule,
    ],
})
export class SpinnerSampleModule {}
