// tslint:disable: no-magic-numbers
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'

// tslint:disable: no-console
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-input-number-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class InputNumberSampleComponent implements OnInit {
    public disabled = false
    public formControl = new FormControl(1.1)
    public value = 3

    public ngOnInit(): void {
        this.formControl.valueChanges.subscribe(value => {
            console.log(`form value change: ${value}`)
        })
    }

    public onValueChange(value: number): void {
        console.log(`value change: ${value}`)
    }
}
