import {ErrorHandler, Injectable} from '@angular/core'
import {
    IndexedDbService,
    ObjectStoreMetaBuilder,
} from '@logi/src/app/global/storage'

const ERROR_LOG_STORE = 'runtime_error_log'

interface ErrorLog {
    readonly message: string
    readonly stack: string
    readonly time: number
    readonly dateTime: string
}

@Injectable()
export class ErrorLoggerService extends ErrorHandler {
    public constructor(private readonly _indexedDbSvc: IndexedDbService) {
        super()
        this._createErrorLogStore()
    }

    // tslint:disable-next-line: unknown-instead-of-any
    public handleError(error: any): void {
        super.handleError(error)
        const message = error.message || error
        const stack = error.stack || error
        const now = new Date()
        const errorLog: ErrorLog = {
            dateTime: now.toLocaleString(),
            message,
            stack,
            time: now.getTime(),
        }
        // tslint:disable-next-line: no-empty
        this._indexedDbSvc.add(ERROR_LOG_STORE, errorLog).subscribe(() => {})
    }

    private _createErrorLogStore(): void {
        const meta = new ObjectStoreMetaBuilder()
            .name(ERROR_LOG_STORE)
            .parameters({autoIncrement: true})
            .build()
        this._indexedDbSvc.createObjectStore(meta).subscribe(() => {
            this._removeOldData()
        })
    }

    private _removeOldData(): void {
        const logRecordsLimit = 50
        this._indexedDbSvc.keepLatestRecords(ERROR_LOG_STORE, logRecordsLimit)
    }
}
