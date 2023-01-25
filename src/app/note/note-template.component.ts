import {
    OnDestroy,
    ViewChild,
    Component,
    ChangeDetectorRef,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core'
import {MatDrawer} from '@angular/material/sidenav'
import {HttpClient} from '@angular/common/http'
import {NoteNavButton, NoteNavButtonBuilder, NoteNavButtonId} from './sidenav'
import {
    GetTemplateInfoRequestBuilder,
    TemplateInfo,
    TemplateTypeEnum,
    UpdateTemplateInfoRequest,
} from '@logi-pb/src/proto/jianda/template_pb'
import {getTemplateInfo, updateTemplateInfo} from '@logi/src/http/jianda'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {NotificationService} from '@logi/src/app/ui/notification'
import {DocConfig, DocConfigBuilder} from '@logi/src/app/common/wps/params'
import {FileTypeEnum} from '@logi-pb/src/proto/wps/wps_pb'
import {ReportTypeEnum} from '@logi-pb/src/proto/jianda/report_pb'
import {DocActionService} from './doc'
import {Subscription} from 'rxjs'
import {FAILED_STATUS} from './const'

@Component({
    selector: 'logi-note-template',
    providers: [DocActionService],
    templateUrl: './note-template.component.html',
    styleUrls: ['./note-common.component.scss','./note-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTemplateComponent implements OnInit, OnDestroy {
    constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _http: HttpClient,
        private readonly _notificationSvc: NotificationService,
        private readonly _docActionSvc: DocActionService,
    ) { }
    @Input() templateId = ''
    @Input() teamId = ''
    @Input() jid = ''
    teamAvatarUrl = 'https://gbkstatic.gubaike.com/image/fua/202111/1MKhLk.png'
    activeNavId: NoteNavButtonId | null = null
    navId = NoteNavButtonId
    loading = true
    docConfig!: DocConfig
    templateInfo!: TemplateInfo
    researchId = ''
    reasearchName = ''

    public get docTypeLabel(): string {
        return this.templateInfo.templateType === TemplateTypeEnum.TEMPLATE_TYPE_DOC ? 'Word' : 'PPT'
    }
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
            .label('模板设置')
            .build(),
    ]

    ngOnInit(): void {
        this._initTemplateInfo()
        this._subs.add(this._docActionSvc.listenSidenavPanelClose().subscribe((
        ) => {
            this._drawer.close()
        }))
    }

    ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    update(req: UpdateTemplateInfoRequest): void {
        updateTemplateInfo(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res) || res.data === undefined) {
                this._notificationSvc.showError(res.message)
                return
            }
            this._notificationSvc.showSuccess('更新成功')
            this.templateInfo = res.data
        })
    }

    onSaveFile(): void {
        this.saveDoc()
    }

    onExportAsPdf(): void {
        this._docActionSvc.exportAsPdf(this.templateInfo)
    }

    onExportAsWord(): void {
        this._docActionSvc.exportAsWord(this.templateInfo)
    }

    async saveDoc(): Promise<boolean> {
        return this._docActionSvc.save()
    }

    onSidenavClick(nav: NoteNavButton): void {
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
    private _subs = new Subscription()
    @ViewChild(MatDrawer) private _drawer!: MatDrawer
    private _initTemplateInfo(): void {
        this.loading = true
        this._cd.detectChanges()
        const req = new GetTemplateInfoRequestBuilder()
            .id(this.templateId)
            .build()
        getTemplateInfo(req, this._http).subscribe(res => {
            this.loading = false
            this._cd.markForCheck()
            if (isHttpErrorResponse(res)) {
                this._notificationSvc.showError('模板文档错误，请稍后重试')
                return
            }
            if (res.status.toUpperCase() === FAILED_STATUS) {
                this._notificationSvc.showError(res.message)
                return
            }
            this.docConfig = new DocConfigBuilder()
                .fileId(this.templateId)
                .fileType(FileTypeEnum.FILE_TYPE_REPORT_TEMPLATE)
                .jid(this.jid)
                .type(ReportTypeEnum.REPORT_TYPE_DOC)
                .build()
            const info = res.data
            if (info === undefined)
                return
            this.templateInfo = info
            document.title = `盈米图书馆 - ${info.title}`
            this.researchId = info.research?.objectId ?? ''
            this.reasearchName = info.research?.objectName ?? ''
        })
    }
}
