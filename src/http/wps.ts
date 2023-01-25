import {HttpClient} from '@angular/common/http'
import {WpsUrlParams, WpsUrlResponse} from '@logi-pb/src/proto/wps/wps_pb'
import {WpsSvcGateWay} from '@logi-pb/src/proto/wps/rpc_grpc_web'
import {HttpErrorResponse, rpcCall} from '@logi/base/ts/common/rpc_call'
import {Observable} from 'rxjs'

import {getInnerApi} from './get_api'

export function getSaasWpsUrl(
    req: WpsUrlParams,
    http: HttpClient,
): Observable<WpsUrlResponse | HttpErrorResponse> {
    return rpcCall(req, WpsSvcGateWay.GET_SAAS_WPS_URL, http, getInnerApi)
}
