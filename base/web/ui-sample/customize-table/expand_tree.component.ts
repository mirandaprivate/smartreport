
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'

// tslint:disable: readonly-array
export interface TreeNodeInterface {
    readonly key: string
    readonly name: string
    readonly age?: number
    readonly level?: number
    // tslint:disable-next-line: readonly-keyword
    expand?: boolean
    readonly address?: string
    readonly children?: readonly TreeNodeInterface[]
    readonly parent?: TreeNodeInterface
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-table-expand-tree',
    templateUrl: './expand_tree.component.html',
    styles: [''],
})
export class ExpandTreeComponent implements OnInit {
    public listOfMapData: readonly TreeNodeInterface[] = [
        {
            key: '1',
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
                {
                    key: '1-1',
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                },
                {
                    key: '1-2',
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [
                        {
                            key: '1-2-1',
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                    ],
                },
                {
                    key: '1-3',
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [
                        {
                            key: '1-3-1',
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                                {
                                    key: '1-3-1-1',
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park',
                                },
                                {
                                    key: '1-3-1-2',
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            key: '2',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]
    public mapOfExpandedData: { [key: string]: readonly TreeNodeInterface[] } = {}

    collapse(
        array: readonly TreeNodeInterface[],
        data: TreeNodeInterface,
        $event: boolean,
    ): void {
        if (!$event)
            if (data.children)
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key)!
                    target.expand = false
                    this.collapse(array, target, false)
                })
            else
        return
    }

    public convertTreeToList(
        root: TreeNodeInterface,
    ): readonly TreeNodeInterface[] {
        const stack: TreeNodeInterface[] = []
        const array: TreeNodeInterface[] = []
        const hashMap = {}
        stack.push({...root, level: 0, expand: false})

        while (stack.length !== 0) {
            const node = stack.pop()!
            this._visitNode(node, hashMap, array)
            if (node.children)
                for (let i = node.children.length - 1; i >= 0; i--)
                    stack.push(
                        {...node.children[i], level: node.level! + 1, expand: false, parent: node},
                    )
        }

        return array
    }

    public ngOnInit(): void {
        this.listOfMapData.forEach(item => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item)
        })
    }

    private _visitNode(
        node: TreeNodeInterface,
        hashMap: { [key: string]: boolean },
        array: TreeNodeInterface[],
    ): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true
            array.push(node)
        }
    }
}
