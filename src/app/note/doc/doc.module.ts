import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {WpsDocsComponent} from './doc.component'
import {DocActionService} from './doc_action.service'

@NgModule({
    declarations: [WpsDocsComponent],
    exports: [WpsDocsComponent],
    imports: [
        CommonModule,
    ],
    providers: [DocActionService],
})
export class DocModule { }
