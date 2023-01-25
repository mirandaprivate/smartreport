import {NgModule} from '@angular/core'

import {FormatTime} from './pipe'

@NgModule({
    declarations: [FormatTime],
    exports: [FormatTime],
})
export class FormatTimeModule {}
