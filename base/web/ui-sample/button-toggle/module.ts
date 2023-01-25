import {NgModule} from '@angular/core'
import {LogiButtonToggleModule} from '@logi/base/web/ui/button-toggle'

import {ButtonToggleSampleComponent} from './component'

@NgModule({
    declarations: [ButtonToggleSampleComponent],
    exports: [ButtonToggleSampleComponent],
    imports: [
        LogiButtonToggleModule,
    ],
})
export class ButtonToggleSampleModule {}
