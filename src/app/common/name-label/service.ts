import {Injectable} from '@angular/core'
import {User} from '@logi-pb/src/proto/jianda/user_pb'
import {Subject} from 'rxjs'

@Injectable()
export class UpdateUserInfoService {
    public infoUpdate(res: User): void {
        this._update$.next(res)
    }

    public infoChanged(): Subject<User> {
        return this._update$
    }

    private _update$ = new Subject<User>()
}
