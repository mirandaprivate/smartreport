// tslint:disable: no-magic-numbers
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {
    NotificationBuilder,
    NotificationService,
    NotificationType,
} from '@logi/base/web/ui/notification'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-notification-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class NotificationSampleComponent {
    public constructor(private readonly _notificationSvc: NotificationService) {
    }

    public openSuccessBar(): void {
        this._notificationSvc.showSuccess('这是一条成功消息')
    }

    public openWarningBar(): void {
        this._notificationSvc.showWarning('这是一条警告消息')
    }

    public openNoticeBar(): void {
        this._notificationSvc.showInfo('这是一条提示消息')
    }

    public openErrorBar(): void {
        this._notificationSvc.showError('这是一条错误消息')
    }

    public openErrorMsgBar(): void {
        const notification = new NotificationBuilder()
            .type(NotificationType.ERROR)
            .main('这是一条带有描述的错误消息')
            .secondary('路径 : 餐厅经营收入 : 综合业务表-年度 / 综合业务表-年度')
            .build()
        this._notificationSvc.show(notification, {duration: 5000})
    }
}
