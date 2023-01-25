import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'

import {PeopleSampleComponent} from './component'

@NgModule({
    declarations: [PeopleSampleComponent],
    exports: [PeopleSampleComponent],
    imports: [
        CommonModule,
        RouterModule,
    ],
})
export class PeopleSampleModule {}
