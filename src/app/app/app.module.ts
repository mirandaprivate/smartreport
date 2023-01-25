import {NgModule} from '@angular/core'
import {SpinnerModule} from '@logi/src/app/ui/spinner'
import {CommonModule} from '@angular/common'
import {AppComponent} from './app.component'
import {LogiNoteModule} from '@logi/src/app/note'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {RouterModule, Routes} from '@angular/router'
import {JwtInterceptor} from './interceptor'
import {JwtService} from './jwt.service'
import {AuthInterceptor} from './auth-interceptor'
// tslint:disable-next-line: readonly-array
export const HTTP_INTERCEPTORS_PROVIDERS = [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
]
const PREFIX = 'editor'
const ROUTES: Routes = [
    {
        component: AppComponent,
        path: PREFIX,
        pathMatch: 'full',
    },
]

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        HttpClientModule,
        LogiNoteModule,
        RouterModule.forRoot(ROUTES),
        SpinnerModule,
    ],
    providers: [
        HTTP_INTERCEPTORS_PROVIDERS,
        JwtService,
    ],
})
export class AppModule { }
