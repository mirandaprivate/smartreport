import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'

import {ProductSampleComponent} from './component'

@NgModule({
    declarations: [ProductSampleComponent],
    exports: [ProductSampleComponent],
    imports: [
        CommonModule,
        RouterModule,
    ],
})
export class ProduceSampleModule {}
