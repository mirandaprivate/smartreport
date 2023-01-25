import {Label} from '@logi/src/app/ui/select'
import {GetTypesResponse_Type} from '@logi-pb/src/proto/jianda/report_pb'
export class SelectImpl {
    transfer = (type: GetTypesResponse_Type): Label => {
        return {
            id: type.id,
            label: type.name,
            value: type,
        }
    }
    tagTransfer = (type: GetTypesResponse_Type): Label => {
        return {
            id: type.id,
            label: type.source ? `${type.name}-${type.source}` : type.name,
            value: type,
        }
    }
}
