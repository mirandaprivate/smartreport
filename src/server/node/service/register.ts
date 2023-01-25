// tslint:disable-next-line: no-wildcard-import
import {registerService, ServerRpcDescriptor} from '@logi/base/ts/grpc/node'
import {
    SERVER_DESC as DocServerDesc,
} from '@logi/src/server/node/service/report/service'
import {Server} from 'grpc'

const SERVER_DESCS:
readonly Map<string, ServerRpcDescriptor<unknown, unknown>>[] = [
    DocServerDesc,
]

export function register(server: Server): void {
    SERVER_DESCS.forEach((
        desc: Map<string, ServerRpcDescriptor<unknown, unknown>>,
    ): void => {
        registerService(server, desc)
    })
}
