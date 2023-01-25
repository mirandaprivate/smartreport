import {PlatformLocation} from '@angular/common'
import {Injectable} from '@angular/core'
import {
    ActivatedRoute,
    NavigationExtras,
    Params as RouterParams,
    Router,
} from '@angular/router'
import {from, Observable} from 'rxjs'

import {
    builderLink,
    formatPid,
    getModelUrl,
    PREFIX,
    RouteType,
    SearchKey,
} from './router'
const TP_INDEX = 2

@Injectable({providedIn: 'root'})
/**
 * Globalrouter service.
 */
export class ArisRouterService {
    public constructor(
        private readonly _router: Router,
        private readonly _activateRoute: ActivatedRoute,
        private readonly _platformLocation: PlatformLocation,
    ) {
    }
    public getParams(path: string): undefined| RouterParams{
        return this._homeParamsMap.get(path)
    }

    public setParams(path: string, params: RouterParams): void{
        this._homeParamsMap.set(path, params)
    }

    public resetParams(): void{
        this._homeParamsMap = new Map<string, RouterParams>()
    }

    public getPreviousHomePath(): undefined | string{
        return this._previousHomePath
    }

    public setPreviousHomePath(path: string): void{
        this._previousHomePath = path
    }

    // tslint:disable-next-line: prefer-function-over-method
    public getTidOrTpid(id: unknown): number | void {
        if (/^[t][p][0-9]*$/.test(String(id)))
            return Number(String(id).substring(TP_INDEX))
        if (/^[t][0-9]*$/.test(String(id)))
            return Number(String(id).substring(1))
        return
    }

    public getBoardLinkUrl(projectId: number): string {
        return `${this
            ._getUrlPrefix()}/${PREFIX}/${RouteType.STOCK}/${formatPid(
            projectId,
        )}/${RouteType.MODEL_BOARD}`
    }

    public getDbLinkUrl(projectId: number): string {
        return `${this
            ._getUrlPrefix()}/${PREFIX}/${RouteType.STOCK}/${formatPid(
            projectId,
        )}/${RouteType.DATABASE}`
    }

    public getParsingLinkUrl(templateId?: number): string {
        const idPath = templateId === undefined ? '' : `/${templateId}`
        return `${this
            ._getUrlPrefix()}/${PREFIX}/${RouteType.PARSING_RULE}${idPath}`
    }

    public getParsingTemplateLinkUrl(): string {
        return `${this
            ._getUrlPrefix()}/${PREFIX}/${RouteType.TEMPLATE}/${RouteType.TEMPLATE_PARSING}`
    }

    public getTemplateUrl(): string {
        const pre = `${this._getUrlPrefix()}/${PREFIX}`
        return `${pre}/${RouteType.MANAGE_BACKEND}/${RouteType.TEMPLATE}`
    }

    public getTemplateLinkUrl(templateId: number, isTemplate = false): string {
        const prefix = this._getUrlPrefix()
        const id = isTemplate ? 'tp' + templateId.toString() : 't' + templateId
            .toString()
        const newUrl = new URL(
            `${prefix}/${PREFIX}/${RouteType.TEMPLATE}/${id}`)
        return newUrl.href
    }

    public getNoteManagementUrl(pid: number, isTemplate: boolean): string {
        const prefix = `${this._getUrlPrefix()}/${PREFIX}`
        return isTemplate ?
            `${prefix}/${RouteType.TEMPLATE}/${RouteType.TEMPLATE_NOTE}` :
            `${prefix}/${RouteType.STOCK}/${formatPid(
                pid,
            )}/${RouteType.NOTE_MANAGE}`
    }

    public getNoteLinkUrl(id: number, isTemplate = false): string {
        const prefix = `${this._getUrlPrefix()}/${PREFIX}`
        return isTemplate ?
            `${prefix}/${RouteType.NOTE_TEMPLATE_EDITOR}/${id}`
            : `${prefix}/${RouteType.NOTE_EDITOR}/${id}`
    }

    public getModelLinkUrl(projectId: number): string {
        const prefix = this._getUrlPrefix()
        const modelUrl = getModelUrl(projectId)
        return `${prefix}/${modelUrl}`
    }

    public getBuilderLink(
        // tslint:disable-next-line: max-params
        modelId: number,
        versionId?: number,
        historyModelId?: number,
        isReadonly = false,
    ): string {
        const prefix = this._getUrlPrefix()
        const newUrl = new URL(
            `${prefix}/${builderLink(modelId, isReadonly)}`)
        if (versionId !== undefined)
            newUrl.searchParams.set(SearchKey.VERSION_ID, versionId.toString())
        if (historyModelId !== undefined)
            newUrl.searchParams
                .set(SearchKey.HIST_MODEL_ID, historyModelId.toString())
        return newUrl.href
    }

    public routerToBuilder(
        modelId: number,
        versionId?: number,
    ): Observable<unknown> {
        const builder = builderLink(modelId)
        const queryParams: RouterParams = {}
        if (versionId !== undefined)
            queryParams[SearchKey.VERSION_ID] = versionId
        return from(this._router
            .navigate([builder], {queryParams, queryParamsHandling: 'merge'}))
    }

    public getQueryParam(key: string): string | undefined {
        const map = this._activateRoute.snapshot.queryParamMap
        const value = map.get(key)
        if (value === null)
            return
        return value
    }

    public currUrl(): string {
        return this._router.url
    }

    /**
     * Jump by url. The url is not the RouteType, it should be a complete url.
     */
    public navigate(
        url: string,
        extras?: NavigationExtras,
    ): Observable<boolean> {
        if (extras !== undefined)
            return from(this._router.navigate([url], extras))
        return from(this._router.navigate([url]))
    }

    public getExtraState<T>(): T | undefined{
        const state = this._router.getCurrentNavigation()?.extras.state
        return state !== undefined ? state as T : undefined
    }

    /**
     * get hostname of current url and navigate to new window
     */
    public navigateInNewWindow(url: string): void {
        if (url.includes('http')) {
            window.open(url, '_blank')
            return
        }
        const prefix = this._getUrlPrefix()
        window.open(`${prefix}/${url}`, '_blank')
    }

    private _previousHomePath = ''

    private _homeParamsMap = new Map<string, RouterParams>()

    private _getUrlPrefix(): string {
        const pl = this._platformLocation
        let host = pl.hostname
        /**
         * 80: http
         * 443: https
         * If host do not add port, it can not jump to new window.
         */
        if (pl.port !== '80' && pl.port !== '443')
            host = `${host}:${pl.port}`
        const origin = `${pl.protocol}//${host}`
        let href = new URL(origin).href
        if (href.endsWith('/')) {
            const codes = href.split('')
            codes.pop()
            href = codes.join('')
        }
        return href
    }
}
