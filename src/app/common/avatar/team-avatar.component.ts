import {
    Component,
    Injector,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser'
import {Subscription} from 'rxjs'

import {AvatarComponent} from './avatar.component'
import {AvatarChangeService} from './avatar-change.service'

@Component({
    host:{
        class:'logi-team-avatar',
    },
    selector: 'logi-team-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss', './team-avatar.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamAvatarComponent extends AvatarComponent implements OnInit,OnDestroy {
    constructor(
        public readonly injector: Injector,
        private readonly _avatarSvc: AvatarChangeService,
        private readonly _cd: ChangeDetectorRef,
    ) {
        super(injector.get(DomSanitizer))
        this.icon ='ic_logo'
    }
    @Input() teamId?: string | null

    ngOnInit(): void {
        this._destoryed$.add(this._avatarSvc.onTeamChange().subscribe(r=>{
            if(r.id !== this.teamId?.toString())
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
