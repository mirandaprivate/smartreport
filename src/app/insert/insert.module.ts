import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ClipboardModule} from '@angular/cdk/clipboard'
import {NotificationModule} from '@logi/src/app/ui/notification'
import {ReactiveFormsModule} from '@angular/forms'
import {NumberTemplateComponent} from './number-template.component'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {TableModule} from './table'
import {SeriesValueDescModule} from './series-value-desc'
import {NumberComponent} from './number.component'
import {RefTypeModule} from './ref-type'
import {TextTemplateComponent} from './text-template.component'
import {TextComponent} from './text.component'

@NgModule({
    declarations: [
        NumberComponent,
        NumberTemplateComponent,
        TextComponent,
        TextTemplateComponent,
    ],
    exports: [
        NumberComponent,
        NumberTemplateComponent,
        TextComponent,
        TextTemplateComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        LogiButtonModule,
        NotificationModule,
        ReactiveFormsModule,
        RefTypeModule,
        SeriesValueDescModule,
        TableModule,
    ],
})
export class InsertModule { }
