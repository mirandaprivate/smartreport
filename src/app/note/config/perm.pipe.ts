import {PermTypeEnum} from '@logi-pb/src/proto/jianda/report_pb'
import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'permType'})
export class PermPipe implements PipeTransform {
    transform = permTypeEumPipe
}

export function permTypeEumPipe(type: PermTypeEnum): string {
    const map = new Map([
        [PermTypeEnum.PERM_TYPE_ALL, '全部'],
        [PermTypeEnum.PERM_TYPE_BU, '本BU'],
        [PermTypeEnum.PERM_TYPE_DEPARTMENT, '本部门'],
        [PermTypeEnum.PERM_TYPE_SELF, '仅自己'],
        [PermTypeEnum.PERM_TYPE_CUSTOM, '自定义'],
    ])
    return map.get(type) ?? ''
}
