// tslint:disable: no-console
import {SelectionModel} from '@angular/cdk/collections'
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {TreeNode, TreeNodeBuilder} from '@logi/base/web/ui/tree'

interface FoodNode {
    readonly name: string
    readonly id: string
    // tslint:disable-next-line: readonly-array
    readonly children?: FoodNode[]
    readonly ignore?: boolean
    readonly disabled?: boolean
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-tree-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class TreeSampleComponent {
    public constructor() {
        this._initDataSource()
    }
    public data!: readonly FoodNode[]

    public getIcon = getIcon
    public mulSel = new SelectionModel<FoodNode>(true)
    public singleSel = new SelectionModel<FoodNode>(false)

    public onChangeData(): void {
        this.data = mockNewData()
    }

    // tslint:disable-next-line: readonly-array
    public getChildren = (node: FoodNode): FoodNode[] => {
        if (!node.children)
            return []
        return node.children.filter(n => !n.ignore)
    }
    public transform = (node: FoodNode, level: number): TreeNode<FoodNode> => {
        // tslint:disable-next-line: no-double-negation
        const expandable = !!node.children && this.getChildren(node).length > 0
        return new TreeNodeBuilder<FoodNode>()
            .dataNode(node)
            .expandable(expandable)
            .id(node.id)
            .level(level)
            .disabled(node.disabled)
            .name(node.name)
            .build()
    }

    public onConfirm(): void {
        console.log(this.singleSel.selected)
        console.log(this.mulSel.selected)
    }

    private _initDataSource(): void {
        // tslint:disable-next-line: no-type-assertion
        this.data = mockData()
        const flatDatas = flat(this.data)
        const singleTarget = flatDatas.find(d => d.id === '5')
        if (singleTarget !== undefined)
            this.singleSel.select(singleTarget)
        const mulTargetIds = ['10', '28', '29', '30', '31', '32', '33', '34']
        const mulTargets = flatDatas.filter(d => mulTargetIds.includes(d.id))
        this.mulSel.select(...mulTargets)
    }
}
type FlatType<T> = T extends ReadonlyArray<infer U> ? FlatType<U> : T
function flat<T extends readonly FoodNode[]>(x: T): readonly FlatType<T>[] {
    const result: FlatType<T>[] = []
    x.forEach(each => {
        // @ts-expect-error
        result.push(each)
        if (each.children !== undefined)
            // @ts-expect-error
            result.push(...flat(each.children))
    })
    return result
}

function mockNewData(): readonly FoodNode[] {
    return [
        {
            children: [
                {name: 'A', id: '0'},
                {name: 'B', id: '1'},
                {name: 'C', id: '2'},
            ],
            id: '3',
            name: 'M',
        },
        {
            children: [
                {
                    children: [
                        {name: 'L', id: '4'},
                        {name: 'R', id: '5'},
                    ],
                    id: '6',
                    name: 'D',
                },
            ],
            id: '7',
            name: 'N',
        },
    ]
}

// tslint:disable-next-line: max-func-body-length
function mockData(): readonly FoodNode[] {
    return [
        {
            children: [
                {
                    children: [
                        {
                            children: [
                                {name: 'j', id: '1', ignore: true},
                                {name: 'k', id: '2', ignore: true},
                                {name: 'l', id: '3', ignore: true},
                            ],
                            id: '4',
                            name: 'lyon',
                        },
                        {
                            children: [
                                {name: 'm', id: '5', disabled: true},
                                {name: 'n', id: '6', ignore: true},
                                {name: 'o', id: '7', ignore: true},
                            ],
                            id: '8',
                            name: 'toulouse',
                        },
                        {
                            children: [
                                {name: 'p', id: '9', disabled: true},
                                {name: 'q', id: '10'},
                                {name: 'r', id: '11', disabled: true},
                            ],
                            id: '12',
                            name: 'marseille',
                        },
                    ],
                    id: '13',
                    name: 'franch',
                },
                {
                    children: [
                        {
                            children: [
                                {name: 'a', id: '14'},
                                {name: 'b', id: '15'},
                                {name: 'c', id: '16', disabled: true},
                            ],
                            id: '17',
                            name: 'milano',
                        },
                        {
                            children: [
                                {name: 'd', id: '18'},
                                {name: 'e', id: '19'},
                                {name: 'f', id: '20', disabled: true},
                            ],
                            id: '21',
                            name: 'napoli',
                        },
                        {
                            children: [
                                {name: 'g', id: '22', ignore: false},
                                {name: 'h', id: '23'},
                                {name: 'i', id: '24', disabled: true},
                            ],
                            id: '25',
                            name: 'rome',
                        },
                    ],
                    id: '26',
                    name: 'italy',
                },
            ],
            id: '27',
            name: 'europe',
        },
        {
            children: [
                {
                    children: [
                        {name: 'Broccoli', id: '28'},
                        {name: 'Brussels sprouts', id: '29'},
                    ],
                    id: '30',
                    name: 'Green',
                },
                {
                    children: [
                        {name: 'Pumpkins', id: '31'},
                        {name: 'Carrots', id: '32'},
                    ],
                    id: '33',
                    name: 'Orange',
                },
            ],
            id: '34',
            name: 'Vegetables',
        },
        {
            children: [
                {
                    children: [
                        {
                            children: [
                                {name: 'j', id: '35'},
                                {name: 'k', id: '36'},
                                {name: 'l', id: '37'},
                            ],
                            id: '38',
                            name: 'lyon',
                        },
                        {
                            children: [
                                {name: 'm', id: '39'},
                                {name: 'n', id: '40'},
                                {name: 'o', id: '41'},
                            ],
                            id: '42',
                            name: 'toulouse',
                        },
                        {
                            children: [
                                {name: 'p', id: '43'},
                                {name: 'q', id: '44'},
                                {name: 'r', id: '45'},
                            ],
                            id: '46',
                            name: 'marseille',
                        },
                    ],
                    id: '47',
                    name: 'franch',
                },
                {
                    children: [
                        {
                            children: [
                                {name: 'a', id: '48'},
                                {name: 'b', id: '49'},
                                {name: 'c', id: '50'},
                            ],
                            id: '51',
                            name: 'milano',
                        },
                        {
                            children: [
                                {name: 'd', id: '52'},
                                {name: 'e', id: '53'},
                                {name: 'f', id: '54'},
                            ],
                            id: '55',
                            name: 'napoli',
                        },
                        {
                            children: [
                                {name: 'g', id: '56'},
                                {name: 'h', id: '57'},
                                {name: 'i', id: '58'},
                            ],
                            id: '59',
                            name: 'rome',
                        },
                    ],
                    id: '60',
                    name: 'italy',
                },
            ],
            id: '61',
            name: 'others',
        },
    ]
}

function getIcon(node: TreeNode<FoodNode>): string {
    return node.expandable ? 'ic_folder' : 'ic_value'
}
