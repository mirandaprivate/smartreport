import {NgModule} from '@angular/core'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {NotificationModule} from '@logi/base/web/ui/notification'

import {NotificationSampleComponent} from './component'

@NgModule({
    bootstrap: [NotificationSampleComponent],
    declarations: [NotificationSampleComponent],
    imports: [
        LogiButtonModule,
        MatSnackBarModule,
        NotificationModule,
    ],
})
export class NotificationSampleModule {}
