import {ArgumentBuilder} from './argument'

export const ENV_PREFIX = 'LOGI'

export const SERVER_LISTEN_PORT = new ArgumentBuilder()
    .arg('grpc_server_port')
    .default('10002')
    .description('Port the server listens to')
    .build()
