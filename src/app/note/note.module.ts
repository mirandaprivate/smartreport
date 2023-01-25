import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MatDialogModule} from '@angular/material/dialog'
import {MatIconModule} from '@angular/material/icon'
import {AvatarModule} from '@logi/src/app/common/avatar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatTooltipModule} from '@angular/material/tooltip'
import {EmptyModule} from '@logi/src/app/common/empty'
import {LogiButtonModule} from '@logi/src/app/ui/button'
import {SpinnerModule} from '@logi/src/app/ui/spinner'
import {LogiMenuModule} from '@logi/src/app/ui/menu'

import {LogiNoteComponent} from './note.component'
import {DbModule} from './db'
import {DocModule} from './doc'
import {NoteTemplateComponent} from './note-template.component'
import {ConfigModule} from './config'

@NgModule({
    declarations: [
        LogiNoteComponent,
        NoteTemplateComponent,
    ],
    exports: [
        LogiNoteComponent,
        NoteTemplateComponent,
    ],
    imports: [
        AvatarModule,
        CommonModule,
        ConfigModule,
        DbModule,
        DocModule,
        EmptyModule,
        LogiButtonModule,
        LogiMenuModule,
        MatDialogModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SpinnerModule,
    ],
})
export class LogiNoteModule {}
