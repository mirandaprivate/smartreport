import {Injectable} from '@angular/core'
import {Subject, Observable} from 'rxjs'

export const LOGI_USER_TOKEN = 'User_token'

@Injectable({providedIn: 'root'})
export class TokenService {
    public setToken(id: string | null): void {
        if (this._userToken === undefined && id !== null)
            this._tokenChange$.next(id)
        this._userToken = id
    }

    public getToken(): string {
        if (this._userToken === undefined || this._userToken === null)
            // tslint:disable-next-line: no-throw-unless-asserts
            throw Error('Do not have user token')
        return this._userToken
    }

    public listenChange(): Observable<string>{
        return this._tokenChange$
    }
    private _userToken!: string | null

    private _tokenChange$ = new Subject<string>()
}
