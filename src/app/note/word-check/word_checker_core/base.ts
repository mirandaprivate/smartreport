import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'

import {TypedWordCheckResult} from './word_check_result'

export class WordCheckError extends Error {
    public constructor(message: string) {
        super()
        this.message = message
    }
}

export function isWordCheckError(obj: unknown): obj is WordCheckError {
    return obj instanceof WordCheckError
}

export abstract class WordChecker {
    public constructor(protected readonly http: HttpClient) {}
    public abstract check(): Observable<readonly TypedWordCheckResult[] | WordCheckError>
}
