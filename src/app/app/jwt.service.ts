import {Injectable} from '@angular/core'

@Injectable()
export class JwtService {
    get jwt(): string {
        return this._jwt
    }

    set jwt(jwt: string) {
        this._jwt = jwt
    }
    private _jwt = ''
}