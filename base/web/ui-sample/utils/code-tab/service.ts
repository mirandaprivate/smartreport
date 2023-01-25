import {
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayConfig,
    OverlayRef,
} from '@angular/cdk/overlay'
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal'
import {ViewportRuler} from '@angular/cdk/scrolling'
import {
    ComponentRef,
    Injectable,
    InjectionToken,
    Injector,
    OnDestroy,
} from '@angular/core'
import {Subscription} from 'rxjs'

import {CodeTabComponent, CODE_TABS_PANEL_DATA} from './component'

/**
 * The width of suggestion panel, it should equal to css style `width`.
 */
const PANEL_WIDTH = 400

@Injectable({providedIn: 'root'})
export class Service implements OnDestroy {
    public constructor(
        private readonly _overlay: Overlay,
        private readonly _injector: Injector,
        private readonly _viewportRuler: ViewportRuler,
    ) {}

    public ngOnDestroy(): void {
        this._closingActionsSubs?.unsubscribe()
        this._viewportSubscription.unsubscribe()
        this._destroyPanel()
    }

    public openPanel(targetElement: HTMLElement, id: string): void {
        this._targetElement = targetElement
        this._attachOverlay(id)
    }

    public closePanel(): void {
        this._overlayRef?.detach()
        this._closingActionsSubs?.unsubscribe()
    }

    private _targetElement!: HTMLElement
    private _overlayRef?: OverlayRef | null
    private _componentRef?: ComponentRef<CodeTabComponent>
    private _closingActionsSubs?: Subscription
    private _viewportSubscription = Subscription.EMPTY
    private _positionStrategy?: FlexibleConnectedPositionStrategy

    private _attachOverlay(id: string): void {
        if (!this._overlayRef) {
            this._overlayRef = this._createOverlayRef()
            this._viewportSubscription = this._viewportRuler.change().subscribe(
                (): void => this._overlayRef?.updateSize({width: PANEL_WIDTH}),
            )
        } else {
            /**
             * The origin (contenteditable div) may be destroyed when update
             * expression, so we need set the new origin.
             */
            this._positionStrategy?.setOrigin(this._targetElement)
            this._overlayRef.updateSize({width: PANEL_WIDTH})
        }

        if (this._overlayRef && !this._overlayRef.hasAttached()) {
            const tokens = new WeakMap<InjectionToken<string>, string>([
                [CODE_TABS_PANEL_DATA, id],
            ])
            const injector = new PortalInjector(this._injector, tokens)
            const portal
                = new ComponentPortal(CodeTabComponent, undefined, injector)
            this._componentRef = this._overlayRef.attach(portal)
            this._componentRef.changeDetectorRef.detectChanges()
        }
    }

    private _createOverlayRef(): OverlayRef {
        const config = new OverlayConfig()
        this._positionStrategy = config.positionStrategy = this._overlay
            .position()
            .flexibleConnectedTo(this._targetElement)
            .withFlexibleDimensions(false)
            .withPush(false)
            .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                },
            ])
        config.scrollStrategy = this._overlay.scrollStrategies.reposition()
        return this._overlay.create(config)
    }

    private _destroyPanel(): void {
        if (this._overlayRef) {
            this.closePanel()
            this._overlayRef.dispose()
            // tslint:disable-next-line: no-null-keyword
            this._overlayRef = null
        }
    }
}
