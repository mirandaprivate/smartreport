import {HttpClient} from '@angular/common/http'
import {Injectable, OnDestroy} from '@angular/core'
import {NotificationService} from '@logi/src/app/ui/notification'
import {Observable, of, BehaviorSubject, Subject} from 'rxjs'
import {tap, map} from 'rxjs/operators'

import {
    isWordCheckError,
    SensitiveWordLevelEnum,
    TypedWordCheckResult,
    WordCheckError,
    LogiWordChecker,
    WordChecker,
} from './word_checker_core'

@Injectable()
export class WordCheckService implements OnDestroy {
    public constructor(
        private readonly _http: HttpClient,
        private readonly _notificationSvc: NotificationService
    ){}
    public ngOnDestroy(): void {
        this._checker = null
        this._checking$.complete()
        this._selectedWord$.complete()
        this._closeResultPanel$.complete()
    }

    public initChecker(reportId: number): void {
        if (this._checker)
            return
        this._checker = new LogiWordChecker(this._http, reportId)
    }

    public check(): Observable<WordCheckError | void> {
        if (this.isChecking())
            return of()
        if (!this._checker)
            return of(new WordCheckError('Checker is not initialized'))
        this._checking$.next(true)
        return this._checker.check().pipe(
            tap(res => {
                if (isWordCheckError(res)) {
                    this._notificationSvc.showError(res.message)
                    this._checking$.next(false)
                    return
                }
                this._checkResult = res
                this._checking$.next(false)
                if (!this._firstCheckDone)
                    this._firstCheckDone = true
            }),
            map(res => {
                return isWordCheckError(res)?res:undefined
            })
        )
    }

    public haveErrorWords(): boolean {
        return this._haveSensitiveWords(
            SensitiveWordLevelEnum.SENSITIVE_LEVEL_ERROR,
        )
    }

    public haveWarnWords(): boolean {
        return this._haveSensitiveWords(
            SensitiveWordLevelEnum.SENSITIVE_LEVEL_WARN,
        )
    }

    /**
     * Return if it has run first checking.
     */
    public isFirstCheckDone(): boolean {
        return this._firstCheckDone
    }

    public getCheckResult(): readonly TypedWordCheckResult[] | null {
        return this._checkResult
    }

    public isChecking(): boolean {
        return this._checking$.value
    }

    public listenChecking(): Observable<boolean> {
        return this._checking$
    }

    public closeResultPanel(): void {
        this._closeResultPanel$.next()
    }

    public listenResultPanelCloseAction(): Observable<void> {
        return this._closeResultPanel$
    }

    public selectWord(word: string | null): void {
        this._selectedWord$.next(word)
    }

    public getSelectedWord(): BehaviorSubject<string | null> {
        return this._selectedWord$
    }

    private _checker: WordChecker | null = null
    private _checking$ = new BehaviorSubject<boolean>(false)
    private _closeResultPanel$ = new Subject<void>()
    private _checkResult: readonly TypedWordCheckResult[] | null = null
    private _firstCheckDone = false
    /**
     * Current selected sensitive word in result view.
     */
    private _selectedWord$ = new BehaviorSubject<string | null>(null)

    private _haveSensitiveWords(type: SensitiveWordLevelEnum): boolean {
        if (!this._checkResult)
            return false
        return this._checkResult.some(r =>
            r.type === type && r.words.length > 0)
    }
}
