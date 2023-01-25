import {HttpClient} from '@angular/common/http'
import {Observable, of} from 'rxjs'

import {WordChecker, WordCheckError} from './base'
import {TypedWordCheckResult} from './word_check_result'

/**
 * 在服务端检索敏感词, 服务端通过 reportId 获得文档内容
 */
export class LogiWordChecker extends WordChecker {
    public constructor(

        protected readonly http: HttpClient,
        protected readonly reportId: number,
    ) {
        super(http)
    }

    public check(
    ): Observable<readonly TypedWordCheckResult[] | WordCheckError> {
        // const request = new ReportGetRequestBuilder()
        //     .reportId(this.reportId)
        //     .build()
        // return checkReport(request, this.http).pipe(map(response => {
        //     if (isHttpErrorResponse(response))
        //         return new WordCheckError(response.message)
        //     /**
        //      * 根据敏感词类型分类
        //      */
        //     const classifiedMap = response.words.reduce(
        //         (map, next) => {
        //             const word = next.word
        //             if (!word)
        //                 // tslint:disable: limit-indent-for-method-in-class
        //                 return map
        //             const existWords = map.get(word.level)
        //             if (!existWords) {
        //                 map.set(
        //                     word.level,
        //                     [{text: word.word, count: next.count}],
        //                 )
        //                 return map
        //             }
        //             existWords.push({text: word.word, count: next.count})
        //             return map
        //         },
        //         new Map<SensitiveWordLevelEnum, CountedWord[]>()
        //     )
        //     return Array.from(classifiedMap.entries()).map(entry =>
        //         new TypedWordCheckResultBuilder()
        //             .type(entry[0])
        //             .words(entry[1])
        //             .build())
        // }))
        return of([])
    }
}
