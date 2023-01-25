import {SelectionModel} from '@angular/cdk/collections'
import {TreeNode, TreeNodeBuilder} from '@logi/src/app/ui/tree'
import {
    Output,
    EventEmitter,
    OnDestroy,
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
} from '@angular/core'
import {
    ItemDataDesc as DataItem,
    isItemDataDesc as isDataItem,
    DataListResponse_Table,
    DataListResponse_Source,
} from '@logi-pb/src/proto/jianda/data_pb'
import {Subscription} from 'rxjs'
type DbNode = DataListResponse_Table | DataItem
const ITEM_ICON = 'ic_value'
const TABLE_ICON = 'ic_folder'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-indicators',
    styleUrls: ['./indicators.style.scss'],
    templateUrl: './indicators.template.html',
})
export class IndicatorsComponent implements OnInit, OnDestroy {
    @Input() source!: DataListResponse_Source
    @Output() readonly selectItem$ = new EventEmitter<DataItem>()
    selection = new SelectionModel<DbNode>(false)
    getIcon = (node: TreeNode<DbNode>): string =>
        isDataItem(node.dataNode) ? ITEM_ICON : TABLE_ICON
    // tslint:disable-next-line: readonly-array
    getChildren = (node: DbNode): DbNode[] => {
        if (isDataItem(node))
            return []
        return node.items.slice()
    }
    transform = (node: DbNode, level: number): TreeNode<DbNode> => {
        if (isDataItem(node))
            return new TreeNodeBuilder<DbNode>()
                .dataNode(node)
                .expandable(false)
                .id(node.id)
                .level(level)
                .name(node.name)
                .build()
        // tslint:disable-next-line: no-double-negation
        const expandable = !!node.items && this.getChildren(node).length > 0
        return new TreeNodeBuilder<DbNode>()
            .dataNode(node)
            .expandable(expandable)
            .id(node.name)
            .level(level)
            .name(node.name)
            .build()
    }
    ngOnInit(): void {
        this._subs.add(this.selection.changed.subscribe(r => {
            const sel = r.added[0]
            if (!isDataItem(sel))
                return
            this.selectItem$.next(sel)
        }))
    }

    ngOnDestroy(): void {
        this._subs.unsubscribe()
    }
    private _subs = new Subscription()
}
