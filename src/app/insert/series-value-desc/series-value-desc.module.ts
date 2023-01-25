import {NgModule} from '@angular/core'
import {SeriesValueDescComponent} from './series-value-desc.component'
import {CommonModule} from '@angular/common'
import {FreqPipe} from './freq.pipe'
import {LogiInputModule} from '@logi/src/app/ui/input'
import {ClipboardModule} from '@angular/cdk/clipboard'
import {NotificationModule} from '@logi/src/app/ui/notification'
import {LogiButtonModule} from '@logi/src/app/ui/button'

@NgModule({
    declarations: [
        FreqPipe,
        SeriesValueDescComponent,
    ],
    exports: [
        FreqPipe,
        SeriesValueDescComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        LogiButtonModule,
        LogiInputModule,
        NotificationModule,
    ],
})
export class SeriesValueDescModule {}
