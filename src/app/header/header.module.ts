import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {HeaderComponent} from './header.component'

@NgModule({
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    imports: [
        CommonModule,
        LogiButtonModule,
    ],
})
export class HeaderModule {}
