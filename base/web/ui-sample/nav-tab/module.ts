import {CommonModule} from '@angular/common'
import {NgModule, Type} from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {RouterModule, Routes} from '@angular/router'
import {NavTabModule, RouteItem} from '@logi/base/web/ui/nav-tab'

import {NavTabSampleComponent} from './component'
import {HomeSampleComponent} from './home'
import {PeopleSampleComponent} from './people'
import {ProductSampleComponent} from './product'

export interface Item extends RouteItem {
    // tslint:disable-next-line: unknown-instead-of-any
    readonly component: Type<any>
}
export const ITEMS: readonly Item[] = [
    {path: 'home', component: HomeSampleComponent},
    {path: 'product', component: ProductSampleComponent},
    {path: 'people', component: PeopleSampleComponent},
]

export const ROUTES: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    ...ITEMS.map(item => {
        return {path: item.path, component: item.component}
    }),
]

@NgModule({
    declarations: [NavTabSampleComponent],
    exports: [NavTabSampleComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        NavTabModule,
        RouterModule.forChild(ROUTES),
    ],
})
export class NavTabSampleModule {}
