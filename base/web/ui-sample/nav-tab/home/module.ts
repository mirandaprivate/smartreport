import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'

import {HomeSampleComponent} from './component'

@NgModule({
    declarations: [HomeSampleComponent],
    exports: [HomeSampleComponent],
    imports: [CommonModule, RouterModule],
})
export class HomeSampleModule {}
