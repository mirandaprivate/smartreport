import {ScrollingModule} from '@angular/cdk/scrolling'
import {CommonModule} from '@angular/common'
import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatDialogModule} from '@angular/material/dialog'
import {MatMenuModule} from '@angular/material/menu'
import {MatSelectModule} from '@angular/material/select'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatTooltipModule} from '@angular/material/tooltip'
import {LogiDialogModule} from '@logi/base/web/ui/dialog'
import {LogiMenuModule} from '@logi/base/web/ui/menu'
import {LogiRadioModule} from '@logi/base/web/ui/radio'

import {UiSampleComponent} from './component'
import {NavTabSampleComponent, ROUTES as Children} from './nav-tab'
import {ROUTE_ITEMS} from './route_item'


export const ROUTES: Routes = [
    {
        children: [
            {path: '', redirectTo: 'button', pathMatch: 'full'},
            {path: 'nav-tab', component: NavTabSampleComponent, children: Children},
            ...ROUTE_ITEMS
                .filter(item => item.route !== 'nav-tab')
                .map(item => {
                    return {path: item.route, component: item.component}
                }),
        ],
        component: UiSampleComponent,
        path: '',
    },
]
@NgModule({
    declarations: [UiSampleComponent],
    exports: [UiSampleComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        LogiDialogModule,
        LogiMenuModule,
        LogiRadioModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTooltipModule,
        ScrollingModule,
        RouterModule.forChild(ROUTES),
    ],
})
export class UiSampleModule {}
