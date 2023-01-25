// tslint:disable-next-line: no-wildcard-import
import * as bunyan from 'bunyan'

export const LOGGER: bunyan = getLogger()

export function getLogger(): bunyan {
    return bunyan.createLogger({
        level: 'debug',
        name: 'airs-node-server',
    })
}
