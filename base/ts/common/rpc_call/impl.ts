// tslint:disable: max-params
import {
    HttpClient,
    HttpErrorResponse as AngularHttpError,
} from '@angular/common/http'
import {MethodInfo} from '@logi/base/ts/grpc/web'
import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'

import {
    HttpErrorResponse,
    HttpErrorResponseBuilder,
} from './http_error_response'
import {HTTP_POST_OPTION} from './http_option'
type GetApiType = (path: string) => string
export function rpcCall<Request, Response>(
    req: Request,
    info: MethodInfo<Request, Response>,
    http: HttpClient,
    getApi: GetApiType,
): Observable<Response | HttpErrorResponse> {
    return getCommonRequest(http, info, req, getApi).pipe(
        map(resp => {
            const str = JSON.stringify(resp)
            return info.responseFromJson(str)
        }),
        catchError<Response, Observable<HttpErrorResponse>>((
            oriErr: AngularHttpError,
        ) => {
            const msg = oriErr.error?.message ?? oriErr.message
            const error = new HttpErrorResponseBuilder()
                .url(info.url)
                .status(oriErr.status)
                .message(msg)
                .build()
            return of(error)
        }),
    )
}

export function rpcCallWithoutErr<Request, Response>(
    req: Request,
    info: MethodInfo<Request, Response>,
    http: HttpClient,
    getApi: GetApiType,
): Observable<Response> {
    return getCommonRequest(http, info, req, getApi).pipe(map(resp => {
        const str = JSON.stringify(resp)
        return info.responseFromJson(str)
    }))
}

function getCommonRequest<Request, Response>(
    http: HttpClient,
    info: MethodInfo<Request, Response>,
    req: Request,
    getApi: GetApiType,
): Observable<object> {
    let body: object | undefined
    let params: {
        // tslint:disable-next-line: no-indexable-types
        readonly [param: string]: string | string[],
    } | undefined
    const reqStr = info.requestToJson(req, false)
    const reqObj = JSON.parse(reqStr) as any
    switch (info.method) {
    case 'get':
    case 'delete':
        params = reqObj
        break
    case 'post':
    case 'patch':
    case 'put':
        body = reqObj
        break
    default:
    }
    const options = {...HTTP_POST_OPTION, ...{body, params}}

    return http.request(info.method, getApi(info.url), options)
}
