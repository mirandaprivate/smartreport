import {HttpClient} from '@angular/common/http'
import {
    CreateDocRequest,
    CreateDocResponse,
    DocToHtmlRequest,
    DocToHtmlResponse,
    DocToPDFRequest,
    DocToPDFResponse,
} from '@logi-pb/src/proto/doc/doc_pb'
import {DocSvcGateWay} from '@logi-pb/src/proto/doc/rpc_grpc_web'
import {HttpErrorResponse, rpcCall} from '@logi/base/ts/common/rpc_call'
import {Observable} from 'rxjs'

import {getInnerApi, getApi} from './get_api'

export function docToHtml(
    req: DocToHtmlRequest,
    http: HttpClient,
): Observable<DocToHtmlResponse | HttpErrorResponse> {
    return rpcCall(req, DocSvcGateWay.DOC_TO_HTML, http, getApi)
}

export function docToPDF(
    req: DocToPDFRequest,
    http: HttpClient,
): Observable<DocToPDFResponse | HttpErrorResponse> {
    return rpcCall(req, DocSvcGateWay.DOC_TO_PDF, http, getInnerApi)
}

export function createDoc(
    req: CreateDocRequest,
    http: HttpClient,
): Observable<CreateDocResponse | HttpErrorResponse> {
    return rpcCall(req, DocSvcGateWay.CREATE_DOC, http, getApi)
}
