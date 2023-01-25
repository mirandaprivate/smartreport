import {Injectable} from '@angular/core'
import {from, Observable} from 'rxjs'

import {ObjectStoreMeta} from './object_store_meta'

// tslint:disable-next-line: naming-convention
const enum DBMode {
    READONLY = 'readonly',
    READWRITE = 'readwrite',
}

const DB_NAME = 'logi'

// tslint:disable: async-promise: no-promise-constructor
// tslint:disable: chain-methods-length-limit
/**
 * https://github.com/assuncaocharles/ngx-indexed-db
 */
@Injectable({providedIn: 'root'})
export class IndexedDbService {
    public constructor() {
        // tslint:disable: unknown-instead-of-any no-type-assertion
        this._indexedDB = window.indexedDB ||
            (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB ||
            (window as any).msIndexedDB
    }

    public createObjectStore(meta: ObjectStoreMeta): Observable<void> {
        return from(new Promise<void>((resolve, reject) => {
            if (this._indexedDB === undefined)
                reject()
            const request = this._indexedDB.open(DB_NAME)
            request.onupgradeneeded = () => {
                const db = request.result
                if (db.objectStoreNames.contains(meta.name)) {
                    resolve()
                    return
                }
                const store = db.createObjectStore(meta.name, meta.parameters)
                meta.indexItems.forEach(item => {
                    store.createIndex(item.name, item.keyPath)
                })

                db.close()
                resolve()
            }
            request.onerror = () => {
                reject()
            }
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        }))
    }

    public add<T>(
        storeName: string,
        value: T,
        key?: IDBValidKey,
    ): Observable<void> {
        return from(new Promise<void>((resolve, reject) => {
            this._openDatabase(DB_NAME).then(db => {
                if (!db.objectStoreNames.contains(storeName))
                    reject()
                const transaction = db.transaction(storeName, DBMode.READWRITE)
                transaction.onabort = e => reject(e)
                transaction.onerror = e => reject(e)
                transaction.oncomplete = () => resolve()

                const store = transaction.objectStore(storeName)
                const request = store.add(value, key)
                request.onsuccess = e => {
                    resolve((e.target as any).result)
                }
                request.onerror = e => {
                    reject(e)
                }
            }).catch(e => reject(e))
        }))
    }

    /**
     * TODO(zengkai): Now this method is only for error logger. it should be
     * removed in future.
     */
    public keepLatestRecords(storeName: string, limit: number): void {
        this._openDatabase(DB_NAME).then(db => {
            if (!db.objectStoreNames.contains(storeName))
                return
            const transaction = db.transaction(storeName, DBMode.READWRITE)
            const store = transaction.objectStore(storeName)
            const request = store.openCursor(undefined, 'prev')
            let i = limit
            request.onsuccess = () => {
                const cursor = request.result
                if (!cursor)
                    return
                i === 0 ? cursor.delete() : i -= 1
                cursor.continue()
            }
        })
    }

    private _indexedDB: IDBFactory
    private async _openDatabase(dbName: string): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (this._indexedDB === undefined)
                reject('IndexedDB not available')
            const request = this._indexedDB.open(dbName)
            request.onsuccess = () => {
                const db = request.result
                resolve(db)
            }
            request.onerror = () => {
                reject(`IndexedDB error: ${request.error}`)
            }
        })
    }
}
