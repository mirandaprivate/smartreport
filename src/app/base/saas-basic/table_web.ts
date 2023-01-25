import {Column} from './column'
import {TableDef} from './table_def'

export abstract class TableWebDef<T> extends TableDef<T>{
    // tslint:disable-next-line: max-func-body-length
    public constructor(
        public readonly columns: readonly Column<T>[],

    ) {
        super(columns)
    }
}
