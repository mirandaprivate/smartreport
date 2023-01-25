import {ChangeDetectionStrategy, Component} from '@angular/core'
import {RouteItem} from '@logi/base/web/ui/nav-tab'

export const ROUTE_ITEMS: readonly RouteItem[] = [
    {path: 'home', text: '数据库'},
    {path: 'product', text: '项目设置'},
    {path: 'people', text: '成员'},
]

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-nav-tab-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class NavTabSampleComponent {
    public routeItems = ROUTE_ITEMS
}
