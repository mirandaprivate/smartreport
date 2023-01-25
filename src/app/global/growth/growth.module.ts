import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'

import {GrowthClassPipe} from './growth-class.pipe'
import {GrowthTextPipe} from './growth-text.pipe'

@NgModule({
    declarations: [GrowthClassPipe, GrowthTextPipe],
    exports: [GrowthClassPipe, GrowthTextPipe],
    imports: [
        CommonModule,
    ],
})
export class GrowthModule { }
