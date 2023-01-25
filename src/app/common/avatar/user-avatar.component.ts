import {
    Component,
    Input,
    Injector,
    OnInit,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser'
import {Subscription} from 'rxjs'

import {AvatarComponent} from './avatar.component'
import {AvatarChangeService} from './avatar-change.service'

@Component({
    host:{
        class: 'logi-user-avatar',
    },
    selector: 'logi-user-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss', './user-avatar.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent extends AvatarComponent implements OnInit,OnDestroy {
    constructor(
        public readonly injector: Injector,
        private readonly _avatarSvc: AvatarChangeService,
        private readonly _cd: ChangeDetectorRef,
    ) {
        super(injector.get(DomSanitizer))
    }

    @Input() public uid!: string

    ngOnInit(): void {
        this._destoryed$.add(this._avatarSvc.onUserChange().subscribe(r=>{
            if(this.uid !== r.id)
                return
            this.url = r.url
            this._cd.detectChanges()
        }))
    }

    ngOnDestroy(): void{
        this._destoryed$.unsubscribe()
    }

    private _destoryed$ = new Subscription()

}
