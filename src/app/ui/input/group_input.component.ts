import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    HostBinding,
    Input,
    OnDestroy,
} from '@angular/core'
import {Subscription} from 'rxjs'

import {LogiInputDirective} from './input.directive'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-group-input',
    styleUrls: ['./group_input.style.css'],
    templateUrl: './group_input.template.html',
})
export class LogiGroupInputComponent implements AfterContentInit, OnDestroy {
    public constructor(private readonly _cd: ChangeDetectorRef) {}

    @Input() public prefixIcon: string | undefined
    @Input() public suffixIcon: string | undefined
    // tslint:disable-next-line: codelyzer-template-property-should-be-public
    @HostBinding('class.logi-focused') public focused = false

    public ngAfterContentInit(): void {
        this._subs.add(this._inputDirective.isFocused$().subscribe(focused => {
            this.focused = focused
            this._cd.markForCheck()
        }))
    }

    public ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    @ContentChild(LogiInputDirective)
    private readonly _inputDirective!: LogiInputDirective
    private readonly _subs = new Subscription()
}
