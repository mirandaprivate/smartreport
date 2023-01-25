import {Injectable} from '@angular/core'
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http'

import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {remove} from '../base/storage/localstorage'
import {NotificationService} from '@logi/src/app/ui/notification'
export const REDIRECT_URL = '/library_v2/login?loginBack='
export const JWT_KEY = 'user---user_info'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private readonly _notificationSvc: NotificationService,
    ) {}
    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(catchError(err => {
            if (!(err instanceof HttpErrorResponse) || err.status !== 401)
                return throwError(err)
            this._notificationSvc.showError('未授权，请登录')
            remove(JWT_KEY)
            window.location.href = `${REDIRECT_URL}${encodeURIComponent(
                window.location.href
            )}`
            return throwError(err)
        }))
    }
}
