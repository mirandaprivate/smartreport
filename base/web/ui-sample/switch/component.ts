import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-switch-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class SwitchSampleComponent implements OnInit {
    public control = new FormControl('')
    public value = ''
    public ngOnInit(): void {
        this.control.valueChanges.subscribe(val => {
            this.value = val
        })
    }

    // tslint:disable-next-line: prefer-function-over-method
    public onSwitchChange(): void {
        // tslint:disable-next-line: no-console
        console.log('from output')
    }
}
