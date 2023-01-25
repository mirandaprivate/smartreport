import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core'
import {
    LogiTableLayout,
    LogiTableSize,
} from '@logi/base/web/ui/customize-table'
import {Subscription, timer} from 'rxjs'

export interface NestNode {
    readonly name: string
    readonly age: number
    readonly address: string
    readonly expandData?: readonly NestNode[]
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-table-nested-sample',
    templateUrl: './nested_table.component.html',
})
export class NestedSampleComponent extends Subscription
implements OnInit, OnDestroy {
    public constructor(private _cd: ChangeDetectorRef) {
        super()
    }
    public loading = true

    @Input() public size: LogiTableSize = 'default'
    @Input() public child = false
    @Input() public showIndent = false
    @Input() public scroll: {x?: null | string, y?: null | string} = {y: "100%"}
    @Input() public layout: LogiTableLayout = 'fixed'

    public expandSet = new Set<string>()
    @Input() public nestedData: readonly NestNode[] = []

    public onExpandChange(id: string, checked: boolean): void {
        if (checked)
            this.expandSet.add(id)
        else
            this.expandSet.delete(id)
    }

    public ngOnInit(): void {
        this.add(timer(1000).subscribe(() => {
            this._cd.markForCheck()
            this.loading = false
            if (this.nestedData?.length !== 0)
                return
            this.nestedData = getData()
        }))
    }

    public ngOnDestroy(): void {
        this.unsubscribe()
    }
}

// tslint:disable: object-literal-sort-keys
// tslint:disable-next-line: max-func-body-length
function getData(): readonly NestNode[] {
    return [
        {
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            expandData: [
                {
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                },
                {
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    expandData: [
                        {
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                        {
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                        },
                        {
                            name: 'Jim Green s',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                        },
                    ],
                },
                {
                    name: 'Jim Green jr.',
                    age: 25,
                    address: 'London No. 3 Lake Park',
                },
                {
                    name: 'Jimmy Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                },
                {
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                },
            ],
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]
}
