import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'
import {LogiRadioChange} from '@logi/base/web/ui/radio'
import {Subscription} from 'rxjs'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-radio-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class RadioSampleComponent implements OnInit {
    public season = ''
    public control = new FormControl('')
    public ngOnInit(): void {
        this._subs.add(this.control.valueChanges.subscribe(val => {
            this.season = val
        }))
    }

    // tslint:disable-next-line: prefer-function-over-method
    public onChange(radioChange: LogiRadioChange): void {
        // tslint:disable-next-line: no-console
        console.log(radioChange.value)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public onSummerChange(radioChange: LogiRadioChange): void {
        // tslint:disable-next-line: no-console
        console.log(radioChange.value)
    }
    private readonly _subs = new Subscription()
}
