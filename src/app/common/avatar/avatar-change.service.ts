import {Injectable, OnDestroy} from '@angular/core'
import {Observable, Subject} from 'rxjs'
import {AvatarChange} from './avatar-change'

@Injectable({
    providedIn: 'root',
})
export class AvatarChangeService implements OnDestroy {
    public onUserChange(): Observable<AvatarChange>{
        return this._userAvatar$
    }

    public userAvatarChange(userImage: AvatarChange): void{
        this._userAvatar$.next(userImage)
    }

    public onTeamChange(): Observable<AvatarChange>{
        return this._teamAvatar$
    }

    public teamAvatarChange(url: AvatarChange): void{
        this._teamAvatar$.next(url)
    }

    ngOnDestroy(): void{
        this._teamAvatar$.complete()
        this._userAvatar$.complete()
    }
    private _teamAvatar$ = new Subject<AvatarChange>()
    private _userAvatar$ = new Subject<AvatarChange>()
}
