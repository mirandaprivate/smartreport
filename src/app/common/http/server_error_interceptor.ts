// tslint:disable: limit-indent-for-method-in-class
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Code, SERVER_ERROR_MESSAGE} from '@logi/src/app/base/http'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
    // tslint:disable-next-line: prefer-function-over-method
    public intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError(err => {
            if (err instanceof HttpErrorResponse
                && (err.status >= Code.SERVER_ERROR
                && err.status < Code.UNPARSEABLE_RESPONSE_HEADERS))
                return throwError(
                    {message: SERVER_ERROR_MESSAGE, status: err.status},
                )
            return throwError(err)
        }))
    }
}
