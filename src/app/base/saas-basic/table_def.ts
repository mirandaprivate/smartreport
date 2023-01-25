// tslint:disable: readonly-array
import {FormControl} from '@angular/forms'
import {Subscription} from 'rxjs'

import {Column} from './column'

export abstract class TableDef<T> extends Subscription {
    // tslint:disable-next-line: max-func-body-length
    public constructor(
        public readonly columns: readonly Column<T>[],
    ) {
        super()
    }
    public selectFormControl = new FormControl()
    public finish = true
    public allData: readonly T[] = []

    public abstract initList(): void
}
