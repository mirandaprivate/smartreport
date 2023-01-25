import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core'
import {IconService} from '@logi/base/web/ui/icon'
import {LogiRadioChange} from '@logi/base/web/ui/radio'
import {timer} from 'rxjs'

import {RouteItem, ROUTE_ITEMS} from './route_item'

const LINK_CLASS = 'logi-theme-style-manage'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-ui-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class UiSampleComponent implements AfterViewInit {
    public constructor(private readonly _iconSvc: IconService) {
        this._iconSvc.registerAllIconsWithoutPrefix()
    }
    public routeItems: readonly RouteItem[] = ROUTE_ITEMS
    public ngAfterViewInit(): void {
        timer().subscribe(() => {
            this._addStyleLink('aris')
        })
    }

    public onThemeChange(change: LogiRadioChange): void {
        const theme = change.value
        this._addStyleLink(theme)
    }

    private _addStyleLink(theme: string): void {
        this._removeStyleLink()
        if (!theme)
            return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.classList.add(LINK_CLASS)
        link.href = `./base/web/ui/core/theming/prebuilt/${theme}-theme.css`
        document.head.appendChild(link)
    }

    private _removeStyleLink(): void {
        const link = document.head.getElementsByClassName(LINK_CLASS)[0]
        if (!link)
            return
        document.head.removeChild(link)
    }
}
