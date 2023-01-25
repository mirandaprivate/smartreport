import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LogiRadioModule} from '@logi/src/app/ui/radio'
import {RefTypeComponent} from './ref-type.component'

@NgModule({
    declarations: [RefTypeComponent],
    exports: [RefTypeComponent],
    imports: [
        CommonModule,
        LogiRadioModule,
    ],
})
export class RefTypeModule {}
