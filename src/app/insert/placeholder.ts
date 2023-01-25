import {PlaceHolderDesc} from '@logi-pb/src/proto/jianda/data_pb'
import {isException} from '@logi/base/ts/common/exception'
export function encode(placeholder: PlaceHolderDesc): string {
    const pe = placeholder.encode()
    if (isException(pe))
        // tslint:disable-next-line: no-throw-unless-asserts
        throw Error(`encode placeholder error: ${pe.message}`)
    let binary = ''
    for (let i = 0, bufferLength = pe.byteLength; i < bufferLength; i += 1)
        binary += String.fromCharCode(pe[i])
    return window.btoa(binary)
}