import {
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
    OnInit,
    Component,
    OnDestroy,
} from '@angular/core'
import {NotificationService} from '@logi/src/app/ui/notification'
import {Subscription} from 'rxjs'

import {
    TypedWordCheckResult,
    isWordCheckError,
    WpsApp,
} from './word_checker_core'
import {WordCheckService} from './word-check.service'
import {DocActionService} from '../doc/doc_action.service'

const TOOLTIP_MSG = `"违规词汇" 必须修改，否则不能提交；
"危险词汇" 不强制修改。`

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-word-check',
    styleUrls: ['./word-check.style.scss'],
    templateUrl: './word-check.template.html',
})
export class WorkCheckComponent implements OnInit, OnDestroy {
    public constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _docActionSvc: DocActionService,
        private readonly _notificationSvc: NotificationService,
        private readonly _wordCheckSvc: WordCheckService
    ) {
    }

    @Input() public wpsApp!: WpsApp
    @Input() public docId!: string

    public results: readonly TypedWordCheckResult[] = []

    public checking = true
    public titleTooltip = TOOLTIP_MSG

    public ngOnInit(): void {
        this._subs.add(
            this._wordCheckSvc.listenChecking().subscribe(checking => {
                this._cd.markForCheck()
                this.checking = checking
                if (checking)
                    return
                const results = this._wordCheckSvc.getCheckResult()
                if (!results)
                    return
                this.results = results
            })
        )
    }

    public ngOnDestroy(): void {
        this.wpsApp = null
        this._subs.unsubscribe()
    }

    public onClosePanel(): void {
        this._docActionSvc.closeSidenavPanel()
    }

    public isFirstCheckDone(): boolean {
        return this._wordCheckSvc.isFirstCheckDone()
    }

    public onStartCheck(): void {
        /**
         * Save doc before word check.
         */
        this._docActionSvc.save().then(result => {
            if (!result)
                return
            this._doWordCheck()
        })
    }

    private _subs = new Subscription()

    private _doWordCheck(): void {
        if (this._wordCheckSvc.isChecking())
            return
        this._wordCheckSvc.check().subscribe(result => {
            if (isWordCheckError(result)) {
                this._notificationSvc.showError(result.message)
                return
            }
            if (this._wordCheckSvc.haveErrorWords()) {
                this._notificationSvc.showWarning('当前文档中包含违规词汇')
                return
            }
        })
    }
}
