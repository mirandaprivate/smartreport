import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatIconModule} from '@angular/material/icon'
import {LogiButtonModule} from '@logi/base/web/ui/button'
import {LogiTransferModule} from '@logi/base/web/ui/transfer'

import {TransferSampleComponent} from './component'

@NgModule({
    bootstrap: [TransferSampleComponent],
    declarations: [TransferSampleComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
        LogiTransferModule,
        MatIconModule,
    ],
})
export class TransferSampleModule {}
