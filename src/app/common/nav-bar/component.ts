import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core'
import {RouteNav} from './route_nav'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'logiNavBar',
    selector: 'logi-nav-bar',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class NavBarComponent {
    @Input() public navTitle = ''
    @Input() public navs: readonly RouteNav[] = []
    @Input() public actionsTpl!: TemplateRef<unknown>
    @Output() public readonly change$ = new EventEmitter<string>()

    public change(nav: RouteNav): void {
        if (nav.disable)
            return
        this.change$.next(nav.path)
    }
}
