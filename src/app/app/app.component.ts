import {
    Component,
    ChangeDetectorRef,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core'
import {ActivatedRoute, ParamMap} from '@angular/router'
import {get} from '@logi/src/app/base/storage/localstorage'
import {IconService} from '@logi/src/app/global/icon/service'
import {NotificationService} from '@logi/src/app/ui/notification'
import {JwtService} from './jwt.service'
import {HttpClient} from '@angular/common/http'
import {PlatformLocation} from '@angular/common'
import {JWT_KEY} from './auth-interceptor'
const REPORT_ID_KEY = 'report_id'
const REPORT_TYPE_KEY = 'report_type'
const DEBUG = false

@Component({
    selector: 'logi-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public constructor(
        private readonly _notificationSvc: NotificationService,
        private readonly _platformLocation: PlatformLocation,
        private readonly _router: ActivatedRoute,
        private readonly _iconSvc: IconService,
        private readonly _cd: ChangeDetectorRef,
        private readonly _http: HttpClient,
        private readonly _jwtSvc: JwtService,
    ) {
        this._iconSvc.registerAllIcons()
    }
    isTemplate = true
    noteId = ''
    teamId = ''
    templateId = ''
    isLogin = false
    jid = ''
    ngOnInit(): void {
        DEBUG ? this._debug() : this._normal()
    }

    private _normal(): void {
        const jwtStr = get(JWT_KEY)
        if (jwtStr === undefined) {
            this.isLogin = true
            this._notificationSvc.showError('获取jwt失败')
            this._cd.markForCheck()
            return
        }
        const sub = this._router.queryParamMap.subscribe(res => {
            if (res.keys.length === 0)
                return
            // tslint:disable-next-line: no-type-assertion
            const jwtValue = JSON.parse(jwtStr) as Jwt
            this.jid = jwtValue.jid
            this._jwtSvc.jwt = jwtValue.jwt
            this._parseUrl(res)
            this.isLogin = true
            this._cd.detectChanges()
            sub.unsubscribe()
        })
    }

    private _debug(): void {
        const host = this._platformLocation.hostname
        const port = this._platformLocation.port
        const protocol = this._platformLocation.protocol
        const jwt1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1NktJZjJTNjNZYUNFRWlnRkI2THljIiwiZXhwIjoxNjMyNzEyNjE2fQ.tgP4xM38QYaky7pxgWpopmfq-14hf6i9acvfyGBeOng'
        this._jwtSvc.jwt = jwt1
        // http://jianda.logiocean.com/editor?report_id=e40211a70c344ecf8218704212e83bcc&report_type=REPORT_TYPE_REPORT
        this.isTemplate = false
        this.noteId = '60c7a9bc8fab4ac089a28d8b7ad89106'
        this.isLogin = true
        this.jid = '7lEaf6wwAJUUla1aq4m4cA'
        this._cd.markForCheck()
        const jwtUrl = `${protocol}//${host}:${port}/editor/api/stockpedia/auth/phone_login?phone=13812341234&code=888888`
        this._http.get(jwtUrl).subscribe(res => {
            // @ts-expect-error for test
            const jwt = res.data?.jwt
            this._jwtSvc.jwt = jwt
            // {"jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1NktJZjJTNjNZYUNFRWlnRkI2THljIiwiZXhwIjoxNjMyNzEyNjE2fQ.tgP4xM38QYaky7pxgWpopmfq-14hf6i9acvfyGBeOng","avatar_url":"https://guojiugo.moyugroup.com/gubaike/app/avatar/default_avatar.jpeg","nick_name":"133***3333"}
            const jwt1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1NktJZjJTNjNZYUNFRWlnRkI2THljIiwiZXhwIjoxNjMyNzEyNjE2fQ.tgP4xM38QYaky7pxgWpopmfq-14hf6i9acvfyGBeOng'
            this._jwtSvc.jwt = jwt1
            // http://jianda.logiocean.com/editor?report_id=e40211a70c344ecf8218704212e83bcc&report_type=REPORT_TYPE_REPORT
            this.isTemplate = false
            this.noteId = '60c7a9bc8fab4ac089a28d8b7ad89106'
            this.teamId = '2AbQK02M0'
            this.templateId = 'Fq3kNYWMk'
            this.jid = '7lEaf6wwAJUUla1aq4m4cA'
            this.isLogin = true
            this._cd.detectChanges()
        })
    }

    private _parseUrl(param: ParamMap): void {
        const reportId = param.get(REPORT_ID_KEY)
        if (reportId === null)
            return
        const reportType = param.get(REPORT_TYPE_KEY)
        if (reportType === ReportType.TEMPLATE) {
            this.isTemplate = true
            this.templateId = reportId
        } else if (reportType === ReportType.REPORT) {
            this.isTemplate = false
            this.noteId = reportId
        }
    }
}
interface Jwt {
    readonly jwt: string
    readonly avatar_url: string
    readonly nick_name: string
    readonly privileges: readonly string[]
    readonly jid: string
}
enum ReportType {
    UNSPECIEFIED = 'REPORT_TYPE_UNSPECIEFIED',
    REPORT = 'REPORT_TYPE_REPORT',
    TEMPLATE = 'REPORT_TYPE_TEMPLATE',
}
