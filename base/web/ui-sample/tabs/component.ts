import {ChangeDetectionStrategy, Component} from '@angular/core'
import {LogiRadioChange} from '@logi/base/web/ui/radio'
import {TabPosition} from '@logi/base/web/ui/tabs'

interface Tab {
    readonly title: string
    readonly content: string
    readonly icon?: string
}

const POSITION_LABEL: Map<TabPosition, string> = new Map([
    ['top', '顶部'],
    ['bottom', '底部'],
    ['left', '左侧'],
    ['right', '右侧'],
])

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-tabs-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class TabsSampleComponent {
    public tabList1: readonly Tab[] = mockTabs()
    public tabList2: readonly Tab[] = [
        {title: '工作簿', content: '工作簿内容', icon: 'ic_excel'},
        {title: '逻辑式', content: '逻辑式内容', icon: 'ic_panel_formula'},
        {title: '勾稽图', content: '勾稽图内容', icon: 'ic_panel_visualizer'},
    ]
    public tabList3: readonly Tab[] = [
        {title: '资产负债表', content: '资产负债表内容'},
        {title: '利润表', content: '利润表内容'},
        {title: '现金流量表', content: '现金流量表内容'},
    ]
    public tabList4: readonly Tab[] = [
        {title: '我参与的', content: '我参与的内容'},
        {title: '我管理的', content: '我管理的内容'},
        {title: '我关注的', content: '我关注的内容'},
    ]
    public positionList: readonly TabPosition[] = ['top', 'bottom', 'left', 'right']
    public position: TabPosition = 'right'
    public direction: 'top' | 'left' = 'top'

    public onSelectPosition(position: TabPosition): void {
        this.position = position
    }

    public onSelectDirection(change: LogiRadioChange): void {
        const direction = change.value
        if (direction === 'horizontal') {
            this.direction = 'top'
            return
        }
        this.direction = 'left'
    }

    public getPositionLabel(position: TabPosition): string {
        return POSITION_LABEL.get(position) || ''
    }
}

function mockTabs(): readonly Tab[] {
    // @ts-ignore
    return Array(20).fill(0).map((e, i) => {
        return {
            title: `标题${i}`,
            content: `内容${i}`,
        }
    })
}
