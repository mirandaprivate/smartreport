import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatIconModule} from '@angular/material/icon'
import {FileUploaderModule} from '@logi/src/app/common/file-uploader'

import {AvatarComponent} from './avatar.component'
import {UserAvatarComponent} from './user-avatar.component'
import {TeamAvatarComponent} from './team-avatar.component'
import {AvatarEditComponent} from './avatar-edit.component'

@NgModule({
    declarations: [
        AvatarComponent,
        AvatarEditComponent,
        TeamAvatarComponent,
        UserAvatarComponent,
    ],
    exports:[
        AvatarComponent,
        AvatarEditComponent,
        TeamAvatarComponent,
        UserAvatarComponent,
    ],
    imports: [
        CommonModule,
        FileUploaderModule,
        MatIconModule,
    ],
})
export class AvatarModule { }
