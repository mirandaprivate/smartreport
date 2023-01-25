// tslint:disable: no-unnecessary-method-declaration
// tslint:disable: no-console prefer-function-over-method no-magic-numbers
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {
    TransferChange,
    TransferConfig,
    TransferDirection,
    TransferItem,
    TransferItemBuilder,
    TransferSelectChange,
} from '@logi/base/web/ui/transfer'

interface RandomNode {
    readonly name: string
    readonly id: string
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-transfer-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class TransferSampleComponent {
    public constructor() {
        const data = mockData()
        this.left = data[0]
        this.right = data[1]
    }
    public config: TransferConfig = {
        leftTitle: 'Left',
        rightTitle: 'Right',
        toLeft: 'To left',
        toRight: 'To right',
    }
    public left: readonly TransferItem<RandomNode>[] = []
    public right: readonly TransferItem<RandomNode>[] = []

    public change(change: TransferChange<RandomNode>): void {
        console.log(change)
    }

    public select(select: TransferSelectChange<RandomNode>): void {
        console.log(select)
    }
}

// tslint:disable-next-line: max-func-body-length
function mockData(): readonly (readonly TransferItem<RandomNode>[])[] {
    const left = []
    const right = []
    for (let i = 0; i < 20; i += 1) {
        const direction = i % 2 === 0 ? TransferDirection.LEFT :
                TransferDirection.RIGHT
        if (direction === TransferDirection.LEFT)
            left.push(new TransferItemBuilder<RandomNode>()
                .checked(false)
                .dataNode({id: `${i}`, name: `row ${i}`})
                .direction(direction)
                .disabled(false)
                .name(`row ${i}`)
                .build(),
            )
        else
            right.push(new TransferItemBuilder<RandomNode>()
                .checked(false)
                .dataNode({id: `${i}`, name: `row ${i}`})
                .direction(direction)
                .disabled(false)
                .name(`row ${i}`)
                .build(),
            )
    }
    return [left, right]
}
