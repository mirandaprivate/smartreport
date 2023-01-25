import {NgModule} from '@angular/core'
import {LogiButtonModule} from '@logi/base/web/ui/button'

import {ButtonSampleComponent} from './component'

@NgModule({
    bootstrap: [ButtonSampleComponent],
    declarations: [ButtonSampleComponent],
    imports: [LogiButtonModule],
})
export class ButtonSampleModule { }
