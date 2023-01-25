import {HttpClientModule} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule, Routes} from '@angular/router'

import {AppComponent} from './component'

const ROUTES: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'ui'},
    {
        path: 'ui',
        loadChildren: () => import('../module').then(m => m.UiSampleModule),
    },
    {path: '*', pathMatch: 'full', redirectTo: 'ui'},
]

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatSnackBarModule,
        RouterModule.forRoot(ROUTES),
    ],
})
export class AppModule {}
