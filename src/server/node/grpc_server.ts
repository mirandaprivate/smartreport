import {ArgumentParser} from 'argparse'
import {Server, ServerCredentials} from 'grpc'

import {ENV_PREFIX, SERVER_LISTEN_PORT} from './lib/args'
import {Argument} from './lib/argument'
import {LOGGER} from './lib/log'
import {get as getViper, set as setViper} from './lib/viper'
import {register} from './service/register'

const MAX_BODY_SIZE = 100 * 1024 * 1024

function exec(port: number): void {
    const server = new Server({
        'grpc.max_send_message_length': MAX_BODY_SIZE,
        'grpc.max_receive_message_length': MAX_BODY_SIZE,
    })
    register(server)
    const host = '0.0.0.0'
    const creds = ServerCredentials.createInsecure()
    server.bindAsync(`${host}:${port}`, creds, (): void => {
        server.start()
        LOGGER.info(`Grpc server listen on ${host}:${port}`)
    })
}

function main(): void {
    const parser = new ArgumentParser()
    const keyArgs: Argument[] = [
        SERVER_LISTEN_PORT,
    ]
    keyArgs.forEach((arg: Argument): void => {
        parser.addArgument([`--${arg.arg}`], {
            defaultValue: arg.default,
            help: arg.description,
        })
    })
    const args = parser.parseArgs()
    keyArgs.forEach((arg: Argument): void => {
        const envValue = process.env[`${ENV_PREFIX}_${arg.arg}`.toUpperCase()]
        setViper(arg.arg, envValue ?? args[arg.arg] ?? arg.default)
    })
    exec(Number(getViper(SERVER_LISTEN_PORT.arg)))
}

main()
