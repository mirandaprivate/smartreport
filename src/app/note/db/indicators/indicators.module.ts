import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {IndicatorsComponent} from './indicators.component'
import {LogiTreeModule} from '@logi/src/app/ui/tree'

@NgModule({
    declarations: [IndicatorsComponent],
    exports: [IndicatorsComponent],
    imports: [
        CommonModule,
        LogiTreeModule,
    ],
})
export class IndicatorsModule {}
