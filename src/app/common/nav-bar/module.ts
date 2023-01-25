import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {NgModule} from '@angular/core'

import {NavBarComponent} from './component'

@NgModule({
    declarations: [NavBarComponent],
    exports: [NavBarComponent],
    imports: [
        CommonModule,
        RouterModule,
    ],
})
export class NavBarModule { }
