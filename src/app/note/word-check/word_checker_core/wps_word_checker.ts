import {HttpClient} from '@angular/common/http'
import {
    SensitiveWord,
    SensitiveWordListRequestBuilder,
    SensitiveWordLevelEnum,
} from '@logi-pb/src/proto/jianda/report_pb'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {getSensitiveWords} from '@logi/src/http/jianda'
import {from, forkJoin, of, Observable} from 'rxjs'
import {map, catchError, mergeMap} from 'rxjs/operators'

import {WordChecker, WordCheckError, isWordCheckError} from './base'
import {
    TypedWordCheckResult,
    TypedWordCheckResultBuilder,
    CountedWord,
} from './word_check_result'

export {SensitiveWordLevelEnum}

export interface TypedDictWords {
    readonly type: SensitiveWordLevelEnum
    readonly words: readonly SensitiveWord[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WpsApp = any

/**
 * @deprecated
 * 从后端读取敏感词库, 使用 WpsApp 对象提供的 API 在前端页面完成检索
 * 该方法将敏感词逐一调用API进行检索, 效率很低
 */
export class WpsWordChecker extends WordChecker {
    public constructor(
        protected readonly http: HttpClient,
        protected readonly wpsApp: WpsApp,
    ) {
        super(http)
    }

    public check(
    ): Observable<readonly TypedWordCheckResult[] | WordCheckError> {
        return this._getAllTypedDictWords().pipe(mergeMap(dicts => {
            if (isWordCheckError(dicts))
                return of(dicts)
            return forkJoin(dicts.map(d => this._doTypedWordCheck(d)))
                .pipe(map(result => {
                    /**
                     * TODO(zengkai): refactor this.
                     */
                    const error = result.find(isWordCheckError)
                    if (error)
                        return error
                    const [errorWords, warnWords] = result
                    if (isWordCheckError(errorWords))
                        return errorWords
                    if (isWordCheckError(warnWords))
                        return warnWords
                    return [errorWords, warnWords]
                }))
        }))
    }

    /**
     * typedDictWords是特定类型的敏感词词库
     * 返回 wps doc 中包含哪些该类型敏感词汇以及包含个数
     */
    private _doTypedWordCheck(
        typedDictWords: TypedDictWords
    ): Observable<TypedWordCheckResult | WordCheckError> {
        if (!this.wpsApp || !typedDictWords)
            return of(new WordCheckError('检索失败: 未获取到文档示例或违规词库'))
        const {type, words: dict} = typedDictWords
        return from(Promise.all(dict.map(w => {
            return this.wpsApp.ActiveDocument.Find.Execute(w.word, false)
        }))).pipe(
            map(result => {
                const countedWords: CountedWord[] = []
                result.forEach((r, i) => {
                    if (r.length === 0 || !dict)
                        return
                    countedWords.push({text: dict[i].word, count: r.length})
                })
                return new TypedWordCheckResultBuilder()
                    .type(type)
                    .words(countedWords)
                    .build()
            }),
            catchError(() => {
                return of(new WordCheckError('检索失败'))
            })
        )
    }

    private _getAllTypedDictWords(
    ): Observable<WordCheckError | readonly TypedDictWords[]> {
        return forkJoin([
            this._getTypedDictWords(
                SensitiveWordLevelEnum.SENSITIVE_LEVEL_ERROR,
            ),
            this._getTypedDictWords(
                SensitiveWordLevelEnum.SENSITIVE_LEVEL_WARN,
            ),
        ]).pipe(map(result => {
            const error = result.find(isWordCheckError)
            if (error)
                return error
            const [errorWords, warnWords] = result
            if (isWordCheckError(errorWords))
                return errorWords
            if (isWordCheckError(warnWords))
                return warnWords
            return [errorWords, warnWords]
        }))
    }

    private _getTypedDictWords(
        type: SensitiveWordLevelEnum
    ): Observable<WordCheckError | TypedDictWords> {
        const request = new SensitiveWordListRequestBuilder()
            .level(type)
            .build()
        return getSensitiveWords(request, this.http).pipe(map(response => {
            return isHttpErrorResponse(response) ?
                new WordCheckError(response.message) : {
                    type,
                    words: response.data,
                }
        }))
    }
}
