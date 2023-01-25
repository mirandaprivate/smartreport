import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {Assets} from '@logi-assets/base/web/images/images_ts'
import {getStatic} from '@logi/src/app/global/static/static'

// tslint:disable-next-line: const-enum
export enum LostStatus {
    LOST,
    LOST_REFREASH,
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-empty',
    styleUrls: ['./style.css'],
    templateUrl: './template.html',
})
export class EmptyComponent {
    @Input() public set message(value: string | undefined) {
        if (value === undefined)
            return
        this._message = value === '' ? '暂无数据' : value
    }

    @Input() public set pic(value: LostStatus | undefined) {
        if (value === undefined)
            return
        switch (value) {
        case LostStatus.LOST:
            this.lostPicture = getStatic(Assets.IMG_LOST_PNG)
            break
        case LostStatus.LOST_REFREASH:
            this.lostPicture = getStatic(Assets.IMG_LOST2_PNG)
            break
        default:
            return
        }
    }
    public lostPicture = getStatic(Assets.IMG_LOST_PNG)

    public getMessage(): string {
        return this._message
    }
    private _message = '数据缺失，正在修复'
}
