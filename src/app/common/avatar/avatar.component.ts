import {Input, Component, ChangeDetectionStrategy} from '@angular/core'
import {DomSanitizer, SafeUrl} from '@angular/platform-browser'
import {isString} from '@logi/base/ts/common/type_guard'

export type AvatarSize = 'big' | 'middle' | 'small'

@Component({
    host:{
        '[class.logi-avatar-big]':'size === "big"',
        '[class.logi-avatar-small]':'size === "small"',
        '[class.logi-avatar-middle]':'size === "middle"',
        class: 'logi-avatar-base',
    },
    selector: 'logi-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent{
    constructor(
        private readonly _domSanitizer: DomSanitizer,
    ){}
    @Input() public set url(value: string | SafeUrl | undefined){
        if(value === undefined || value.toString().length === 0)
            return
        this._url = isString(value) ? this._domSanitizer
            .bypassSecurityTrustUrl(value) : value
    }

    public get url(): SafeUrl | string | undefined {
        return this._url

    }
    @Input() public icon?: string
    @Input() public set size(value: AvatarSize){
        this._size = value
    }

    public get size(): AvatarSize{
        return this._size
    }
    private _size: AvatarSize = 'small'

    private _url?: SafeUrl
}
