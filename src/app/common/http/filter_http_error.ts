import {HttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {Code} from '@logi/src/app/base/http'

/**
 * filter the processed HTTP error
 */
export function filterHttpError(res: HttpErrorResponse): boolean {
    if (res.status === Code.NETWORK_DOWN)
        return true
    if (res.status === Code.NO_RESPONSE)
        return true
    if (res.status >= Code.SERVER_ERROR &&
        res.status < Code.UNPARSEABLE_RESPONSE_HEADERS)
        return true
    if (res.status === Code.AUTH)
        return true
    return false
}

export function isServerError(res: HttpErrorResponse): boolean {
    if (res.status === Code.NO_RESPONSE)
        return true
    if (res.status >= Code.SERVER_ERROR &&
        res.status < Code.UNPARSEABLE_RESPONSE_HEADERS)
        return true
    return false
}
