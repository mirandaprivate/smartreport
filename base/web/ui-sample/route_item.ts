import {Type} from '@angular/core'

import {ButtonSampleComponent} from './button'
import {ButtonToggleSampleComponent} from './button-toggle'
import {CascadedSelectSampleComponent} from './cascaded-select'
import {CheckboxSampleComponent} from './checkbox'
import {ComboboxSampleComponent} from './combobox'
import {LogiCustomizeTableSampleComponent} from './customize-table'
import {DialogSampleComponent} from './dialog'
import {FormFieldSampleComponent} from './form-field'
import {IconSampleComponent} from './icon'
import {InputSampleComponent} from './input'
import {InputNumberSampleComponent} from './input-number'
import {ListSampleComponent} from './list'
import {MenuSampleComponent} from './menu'
import {NavTabSampleComponent} from './nav-tab'
import {NotificationSampleComponent} from './notification'
import {PopoverSampleComponent} from './popover'
import {RadioSampleComponent} from './radio'
import {ScrollbarSampleComponent} from './scrollbar'
import {SelectSampleComponent} from './select'
import {SliderSampleComponent} from './slider'
import {SpinnerSampleComponent} from './spinner'
import {SwitchSampleComponent} from './switch'
import {TableSampleComponent} from './table'
import {TabsSampleComponent} from './tabs'
import {TagSampleComponent} from './tag'
import {TransferSampleComponent} from './transfer'
import {TreeSampleComponent} from './tree'

export interface RouteItem {
    readonly route: string
    readonly text: string
    readonly component: Type<unknown>
}

// tslint:disable-next-line: readonly-array
export const ROUTE_ITEMS: RouteItem[] = [
    {route: 'button', text: 'Button 按钮', component: ButtonSampleComponent},
    {route: 'button-toggle', text: 'Button Toggle 按钮组', component: ButtonToggleSampleComponent},
    {route: 'cascaded-select', text: 'Cascaded Select 级联选择框', component: CascadedSelectSampleComponent},
    {route: 'checkbox', text: 'Checkbox 多选框', component: CheckboxSampleComponent},
    {route: 'combobox', text: 'Combobox 组合框', component: ComboboxSampleComponent},
    {route: 'dialog', text: 'Dialog 对话框', component: DialogSampleComponent},
    {route: 'form-field', text: 'Form Field 表单项', component: FormFieldSampleComponent},
    {route: 'icon', text: 'Icon 图标', component: IconSampleComponent},
    {route: 'input', text: 'Input 输入框', component: InputSampleComponent},
    {route: 'input-number', text: 'InputNumber 数值输入框', component: InputNumberSampleComponent},
    {route: 'list', text: 'List 列表', component: ListSampleComponent},
    {route: 'menu', text: 'Menu 菜单', component: MenuSampleComponent},
    {route: 'nav-tab', text: 'Nav Tab 导航标签页', component: NavTabSampleComponent},
    {route: 'notification', text: 'Snackbar 消息条', component: NotificationSampleComponent},
    {route: 'popover', text: 'Popover 弹出框', component: PopoverSampleComponent},
    {route: 'radio', text: 'Radio 单选框', component: RadioSampleComponent},
    {route: 'scrollbar', text: 'Scrollbar 滚动条', component: ScrollbarSampleComponent},
    {route: 'select', text: 'Select 选择框', component: SelectSampleComponent},
    {route: 'slider', text: 'Slider 滑块', component: SliderSampleComponent},
    {route: 'spinner', text: 'Spinner 旋转加载', component: SpinnerSampleComponent},
    {route: 'switch', text: 'Switch 开关', component: SwitchSampleComponent},
    {route: 'table', text: 'Table 表格', component: TableSampleComponent},
    {route: 'tabs', text: 'Tabs 标签页', component: TabsSampleComponent},
    {route: 'tag', text: 'Tag 标签', component: TagSampleComponent},
    {route: 'tree', text: 'Tree 树形', component: TreeSampleComponent},
    {route: 'transfer', text: 'Transfer 穿梭框', component: TransferSampleComponent},
    {route: 'customize-table', text: 'customize table 表格', component: LogiCustomizeTableSampleComponent},
]
