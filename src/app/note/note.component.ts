import {HttpClient} from '@angular/common/http'
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    ChangeDetectorRef,
    OnInit,
    ViewChild,
} from '@angular/core'
import {MatDrawer} from '@angular/material/sidenav'
import {DocConfig, DocConfigBuilder} from '@logi/src/app/common/wps/params'
import {Subscription} from 'rxjs'

import {DocActionService} from './doc'

import {NoteNavButton, NoteNavButtonId, NoteNavButtonBuilder} from './sidenav'
import {
    ReportTypeEnum,
    ReportInfo,
    ReportInfoRequestBuilder,
    ReportInfoUpdateRequest,
} from '@logi-pb/src/proto/jianda/report_pb'
import {getReportInfo, reportInfoUpdate} from '@logi/src/http/jianda'
import {NotificationService} from '@logi/src/app/ui/notification'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {FileTypeEnum} from '@logi-pb/src/proto/wps/wps_pb'
import {FAILED_STATUS} from './const'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DocActionService],
    selector: 'logi-note',
    styleUrls: ['./note-common.component.scss','./note.style.css'],
    templateUrl: './note.template.html',
})
export class LogiNoteComponent implements OnInit, OnDestroy {
    public constructor(
        private readonly _notificationSvc: NotificationService,
        private readonly _http: HttpClient,
        private readonly _cd: ChangeDetectorRef,
        private readonly _docActionSvc: DocActionService,
    ) {}

    @Input() noteId = ''
    @Input() teamId = ''
    @Input() jid = ''
    get researchName(): string {
        return this.reportInfo.researchTarget?.name ?? ''
    }
    researchId = ''
    loading = true
    reportInfo!: ReportInfo
    teamAvatarUrl = 'https://gbkstatic.gubaike.com/image/fua/202111/1MKhLk.png'
    docConfig!: DocConfig
    navId = NoteNavButtonId
    activeNavId: NoteNavButtonId | null = null
    sidenavButtons1: readonly NoteNavButton[] = [
        new NoteNavButtonBuilder()
            .id(NoteNavButtonId.NUMBER)
            .icon('ic_template_import')
            .label('插入数据')
            .build(),
        new NoteNavButtonBuilder()
            .id(NoteNavButtonId.TEXT)
            .icon('ic_insert_text')
            .label('插入文本')
            .build(),
    ]
    sideNavButtons2: readonly NoteNavButton[] = [
        new NoteNavButtonBuilder()
            .id(NoteNavButtonId.CONFIG)
            .icon('ic_tab_setting')
            .label('文档设置')
            .build(),
    ]

    public get docTypeLabel(): string {
        return this.reportInfo.reportType === ReportTypeEnum.REPORT_TYPE_DOC ? 'Word' : 'PPT'
    }

    ngOnInit(): void {
        const req = new ReportInfoRequestBuilder().id(this.noteId).build()
        getReportInfo(req, this._http).subscribe(res => {
            this.loading = false
            this._cd.markForCheck()
            if (isHttpErrorResponse(res)) {
                this._notificationSvc.showError('文档错误，请稍后重试')
                return
            }
            if (res.status.toUpperCase() === FAILED_STATUS) {
                this._notificationSvc.showError(res.message)
                return
            }
            const info = res.data
            if (info === undefined)
                return
            this.docConfig = new DocConfigBuilder()
                .jid(this.jid)
                .fileId(this.noteId)
                .fileType(FileTypeEnum.FILE_TYPE_REPORT)
                .type(info.reportType)
                .build()
            document.title = `盈米图书馆-${info.title}`
            this.reportInfo = info
            this.researchId = info.researchTarget?.id ?? ''
        })
        this._subs.add(this._docActionSvc.listenSidenavPanelClose().subscribe((
        ) => {
            this._drawer.close()
        }))
    }

    public ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    update(req: ReportInfoUpdateRequest): void {
        reportInfoUpdate(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res) || res.data === undefined) {
                this._notificationSvc.showError('更新失败')
                return
            }
            this._notificationSvc.showSuccess('更新成功')
            this.reportInfo = res.data
        })
    }

    public onSaveFile(): void {
        this.saveDoc()
    }

    public onExportAsPdf(): void {
        this._docActionSvc.exportAsPdf(this.reportInfo)
    }

    public onExportAsWord(): void {
        this._docActionSvc.exportAsWord(this.reportInfo)
    }

    public async saveDoc(): Promise<boolean> {
        return this._docActionSvc.save()
    }

    public onSidenavClick(nav: NoteNavButton): void {
        if (nav.disabled)
            return
        const navId = nav.id
        if (this.activeNavId === null) {
            this.activeNavId = navId
            this._drawer.open()
            return
        }
        if (this.activeNavId === navId) {
            this._drawer.close()
            return
        }
        this.activeNavId = navId
    }

    public onSidenavClose(): void {
        this.activeNavId = null
    }

    @ViewChild(MatDrawer) private _drawer!: MatDrawer

    private _subs = new Subscription()
}
