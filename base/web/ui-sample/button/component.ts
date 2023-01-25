// tslint:disable: prefer-function-over-method no-console no-magic-numbers
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core'
import {timer} from 'rxjs'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-button-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ButtonSampleComponent {
    public constructor(private readonly _cd: ChangeDetectorRef) {}
    public disabled = false
    public color: 'primary' | 'warn' = 'primary'
    public loading = false

    public onClickLoadingButton(): void {
        console.log('click loading button')
        this.loading = true
        timer(5000).subscribe(() => {
            this.loading = false
            this._cd.markForCheck()
        })
    }
}
