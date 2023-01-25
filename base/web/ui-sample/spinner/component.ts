import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core'
import {timer} from 'rxjs'
import {} from 'rxjs/operators'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-spinner-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class SpinnerSampleComponent {
    public constructor(
        private readonly _cd: ChangeDetectorRef,
    ) {}
    public spinning = false
    public onNext(): void {
        this.spinning = true
        const wait = 1000
        timer(wait).subscribe(() => {
            this.spinning = false
            this._cd.markForCheck()
        })
    }
}
