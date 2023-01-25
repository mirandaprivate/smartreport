import {Injectable} from '@angular/core'
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http'
import {JwtService} from './jwt.service'

import {Observable} from 'rxjs'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private readonly _jwtSvc: JwtService,
    ) {}
    intercept(req: HttpRequest<unknown>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
        const jwt = `jwt ${this._jwtSvc.jwt}`
        const newHeaders = req.headers.append('Authorization', jwt)
        const newReq = req.clone({headers: newHeaders})
        return next.handle(newReq)
    }
}