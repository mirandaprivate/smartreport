// tslint:disable: unknown-instead-of-any
import {HttpClient} from '@angular/common/http'
import {
    ElementRef,
    ChangeDetectorRef,
    Injector,
    NgZone,
    Renderer2,
} from '@angular/core'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {WpsUrlParamsBuilder} from '@logi-pb/src/proto/wps/wps_pb'
import {getSaasWpsUrl} from '@logi/src/http/wps'
import {TokenService} from '@logi/src/app/global/token/service'
import {NotificationService} from '@logi/src/app/ui/notification'
import {
    config as configWps,
    ICommonOptions,
    IConfig,
    IFlag,
    IWps,
    IWpsCommandBars,
} from 'wps'
import {Subscription, BehaviorSubject} from 'rxjs'

import {WpsConfig} from './base_config'

export abstract class BaseWps extends Subscription {
    // tslint:disable-next-line: max-func-body-length
    public constructor(
        public readonly injector: Injector,
        public readonly commandBars?: readonly IWpsCommandBars[],
        public readonly options: ICommonOptions = {
            isBrowserViewFullscreen: true,
            isIframeViewFullscreen: true,
            isParentFullscreen: true,
            isShowHeader: true,
            isShowTopArea: true,
        },
        public readonly iFlag?: IFlag,
    ) {
        super()
        this.cd = this.injector.get(ChangeDetectorRef)
        this.http = this.injector.get(HttpClient)
        this.noticeSvc = this.injector.get(NotificationService)
        this.tokenSvc = this.injector.get(TokenService)
        this.renderer = this.injector.get(Renderer2)
        this.ngZone = this.injector.get(NgZone)
        this.add(this.tokenSvc.listenChange().subscribe(async r => {
            await this.wps.setToken({
                hasRefreshTokenConfig: false,
                token: r,
            })
        }))
    }

    public cd!: ChangeDetectorRef
    public http!: HttpClient
    public noticeSvc!: NotificationService
    public ngZone!: NgZone
    public tokenSvc!: TokenService
    public renderer!: Renderer2
    public docReady = false
    public abstract data: WpsConfig
    public abstract element: ElementRef<HTMLDivElement>
    public wps!: IWps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public app!: any
    // tslint:disable-next-line: async-promise
    public abstract initView(): Promise<void>

    /**
     * should call getSig() after init
     */
    // tslint:disable-next-line: unknown-instead-of-any
    public init(): void {
        const req = new WpsUrlParamsBuilder()
            .fileId(this.data._w_file_id)
            .fileType(this.data._w_file_type)
            .tokenType(this.data._w_tokentype)
            .wpsType(this.data.getWpsType())
            .userId(this.data.jid)
        if (this.data.versionId !== undefined)
            req.versionId(this.data.versionId)
        getSaasWpsUrl(req.build(), this.http).subscribe(async r => {
            if (isHttpErrorResponse(r)) {
                this.noticeSvc.showError('获取wps saas url失败')
                return
            }
            const config = this._config(r.url)
            this.wps = configWps(config)
            this.wpsReady$.next(true)
            await this.wps.ready()
            // tslint:disable-next-line: no-non-null-assertion
            this.app = this.wps.Application
            this._setIframe()
            await this.initView()
            this.docReady = true
            this.cd.markForCheck()
        })
    }
    protected readonly wpsReady$ = new BehaviorSubject<boolean>(false)

    private _setIframe(): void {
        this.renderer.setStyle(this.wps.iframe, 'height', '100%')
        this.renderer.setStyle(this.wps.iframe, 'width', '100%')
    }

    private _config(url: string): IConfig {
        const commonOptions = this.options
        const config: IConfig = {
            commandBars: this.commandBars ? this.commandBars
                .slice() : undefined,
            commonOptions,
            mount: this.element.nativeElement,
        }
        if (this.iFlag) {
            config.onToast = this.iFlag.onToast
            config.refreshToken = this.iFlag.refreshToken
            config.getClipboardData = this.iFlag.getClipboardData
            config.onHyperLinkOpen = this.iFlag.onHyperLinkOpen
        }
        config.url = url
        return config
    }
}
