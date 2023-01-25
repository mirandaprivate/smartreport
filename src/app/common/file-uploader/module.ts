import {NgModule} from '@angular/core'
import {MatSnackBarModule} from '@angular/material/snack-bar'

import {FileUploaderComponent} from './component'

@NgModule({
    declarations: [FileUploaderComponent],
    exports: [FileUploaderComponent],
    imports: [
        MatSnackBarModule,
    ],
})
export class FileUploaderModule {}
