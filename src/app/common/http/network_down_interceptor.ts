// tslint:disable: limit-indent-for-method-in-class
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Code} from '@logi/src/app/base/http'
import {isNetwork, OFFLINE_MESSAGE} from '@logi/src/app/base/utils'
import {Observable, throwError} from 'rxjs'

@Injectable()
export class NetworkDownInterceptor implements HttpInterceptor {
    // tslint:disable-next-line: prefer-function-over-method
    public intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        if (!isNetwork())
            return throwError(
                {message: OFFLINE_MESSAGE, status: Code.NETWORK_DOWN},
            )
        return next.handle(request)
    }
}
