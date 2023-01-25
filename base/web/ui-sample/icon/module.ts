import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'

import {IconSampleComponent} from './component'

@NgModule({
    bootstrap: [IconSampleComponent],
    declarations: [IconSampleComponent],
    imports: [
        CommonModule,
        MatIconModule,
    ],
})
export class IconSampleModule {}
