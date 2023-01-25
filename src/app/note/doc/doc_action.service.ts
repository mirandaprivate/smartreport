import {HttpClient} from '@angular/common/http'
import {Injectable, OnDestroy} from '@angular/core'
import {Observable, Subject} from 'rxjs'
import {NotificationService} from '@logi/src/app/ui/notification'
import {WpsFileType} from '@logi/src/app/common/wps/params'
import {
    WpsApp,
    DocAction,
    WordDocAction,
    PptDocAction,
    getSaveNotification,
} from './doc_action'
import {ReportInfo} from '@logi-pb/src/proto/jianda/report_pb'
import {TemplateInfo} from '@logi-pb/src/proto/jianda/template_pb'

@Injectable()
export class DocActionService implements OnDestroy {
    public constructor(
        private readonly _notificationSvc: NotificationService,
        private readonly _http: HttpClient,
    ) {
    }
    public init(app: WpsApp, fileId: string, fileType: WpsFileType): void {
        this._fileType = fileType
        if (this._docAction)
            return
        if (fileType === WpsFileType.WORD)
            this._docAction = new WordDocAction(this._http, app, fileId)
        else if (fileType === WpsFileType.PPT)
            this._docAction = new PptDocAction(this._http, app, fileId)
    }

    public getWordDocAction(): WordDocAction | undefined {
        if (this._fileType === WpsFileType.WORD)
            // tslint:disable-next-line: no-type-assertion
            return this._docAction as WordDocAction
        return
    }

    public ngOnDestroy(): void {
        this._docAction = null
        this._sidenavPanelClose$.complete()
    }

    public closeSidenavPanel(): void {
        this._sidenavPanelClose$.next()
    }

    public listenSidenavPanelClose(): Observable<void> {
        return this._sidenavPanelClose$
    }

    public async save(): Promise<boolean> {
        if (!this._docAction)
            return false
        const result = await this._docAction.save()
        const notification = getSaveNotification(result)
        if (notification)
            this._notificationSvc.show(notification)
        return result.error === undefined
    }

    public async insertText(text:string): Promise<void> {
        this._docAction?.insertText(text)
    }

    public exportAsWord(content: ReportInfo | TemplateInfo): void {
        this._docAction?.exportAsWord(content)
    }

    public exportAsPdf(content: ReportInfo | TemplateInfo): void {
        this._docAction?.exportAsPdf(content)
    }

    private _fileType: WpsFileType = WpsFileType.UNKNOWN
    private _sidenavPanelClose$ = new Subject<void>()
    private _docAction: DocAction | null = null
}
