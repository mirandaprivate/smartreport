import {
    InnerSvcServiceHandlerFactoryBuilder,
} from '@logi-pb/src/proto/inner/rpc_grpc'

import {getDocContent} from './content'
import {getPlaceholderIDs} from './placeholder'
import {renderTemplate} from './render'
import {calculateDate} from './date'

export const SERVER_DESC = new InnerSvcServiceHandlerFactoryBuilder()
    .getDocContent(getDocContent)
    .getPlaceholderIDs(getPlaceholderIDs)
    .renderTemplate(renderTemplate)
    .calculateDate(calculateDate)
    .build()
    .getServerDesc()
