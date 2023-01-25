import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core'
import {Subscription} from 'rxjs'

import {UpdateUserInfoService} from './service'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-name-label',
    styleUrls: ['./style.css'],
    templateUrl: './template.html',
})
export class NameLabelComponent implements OnInit, OnDestroy {
    public constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _updateUserInfoSvc: UpdateUserInfoService,
    ) {}

    @Input() public userName?: string
    @Input() public userId?: string
    @Input() public textType = false

    public ngOnInit(): void {
        this._subs.add(this._updateUserInfoSvc.infoChanged().subscribe(u => {
            if (this.userName === undefined ||
            this.userId === undefined ||
            u.id !== this.userId)
                return
            this.userName = u.fullName
            this._cd.detectChanges()
        }))
    }

    public ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    private _subs = new Subscription()
}
