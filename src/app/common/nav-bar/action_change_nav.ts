import {Directive, ViewChild} from '@angular/core'
import {ActionAttachedRoute} from '@logi/src/app/base/router'
import {NavBarComponent} from './component'

@Directive()
export abstract class ActionChangeNav {
    public routeActivate(route: ActionAttachedRoute): void {
        if (!route.navActionTpl || !this._navBar)
            return
        this._navBar.actionsTpl = route.navActionTpl
    }

    @ViewChild(NavBarComponent, {static: true})
    private readonly _navBar!: NavBarComponent
}
