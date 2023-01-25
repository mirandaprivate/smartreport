import {
    Notification,
    NotificationBuilder,
    NotificationType,
} from '@logi/src/app/ui/notification'

import {SaveResult} from './base'

// tslint:disable-next-line: unknown-instead-of-any
export function getSaveNotification(result: SaveResult): Notification | null {
    const error = result.error ?? false
    if (error)
        return new NotificationBuilder()
            .main('保存失败')
            .type(NotificationType.ERROR)
            .build()
    const status = result.result
    /**
     * more details in
     * https://wwo.wps.cn/docs/front-end/API/Word/ActiveDocument/functions/Save/
     */
    switch (status) {
    case 'ok':
        return new NotificationBuilder()
            .main('保存成功')
            .type(NotificationType.SUCCESS)
            .build()
    case 'nochange':
        return null
    case 'SavedEmptyFile':
        return new NotificationBuilder()
            .main('暂不支持保存空文件')
            .type(NotificationType.INFO)
            .build()
    case 'SpaceFull':
        return new NotificationBuilder()
            .main('空间已满')
            .type(NotificationType.INFO)
            .build()
    case 'QueneFull':
        return new NotificationBuilder()
            .main('保存中请勿频繁操作')
            .type(NotificationType.INFO)
            .build()
    case 'fail':
        return new NotificationBuilder()
            .main('保存失败')
            .type(NotificationType.ERROR)
            .build()
    default:
        return new NotificationBuilder()
            .main('保存失败')
            .type(NotificationType.ERROR)
            .build()
    }
}
