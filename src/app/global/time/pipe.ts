import {Pipe, PipeTransform} from '@angular/core'
import {getTime} from '@logi/src/app/base/date'
// tslint:disable-next-line: no-wildcard-import
import * as Long from 'long'

@Pipe({name: 'formatTime'})
export class FormatTime implements PipeTransform {
    // tslint:disable: prefer-function-over-method
    // tslint:disable-next-line: no-unnecessary-method-declaration
    public transform(value: Long | null | undefined): string {
        return getTime(value)
    }
}
