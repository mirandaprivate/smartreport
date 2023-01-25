import {NgModule} from '@angular/core'
import {SourceNamesModule} from './source-names'
import {CommonModule} from '@angular/common'
import {DbTemplateNumberComponent} from './db-template-number.component'
import {InsertModule} from '@logi/src/app/insert'
import {ClipboardModule} from '@angular/cdk/clipboard'
import {EmptyModule} from '@logi/src/app/common/empty'
import {SpinnerModule} from '@logi/src/app/ui/spinner'
import {IndicatorsModule} from './indicators'
import {BaseDirective} from './base.directive'
import {DbNumberComponent} from './db-number.component'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {HeaderModule} from '@logi/src/app/header'
import {DbTemplateTextComponent} from './db-template-text.component'
import {DbTextComponent} from './db-text.component'

@NgModule({
    declarations: [
        BaseDirective,
        DbNumberComponent,
        DbTemplateNumberComponent,
        DbTemplateTextComponent,
        DbTextComponent,
    ],
    exports: [
        DbNumberComponent,
        DbTemplateNumberComponent,
        DbTemplateTextComponent,
        DbTextComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        EmptyModule,
        HeaderModule,
        IndicatorsModule,
        InsertModule,
        LogiButtonModule,
        SourceNamesModule,
        SpinnerModule,
    ],
})
export class DbModule { }
