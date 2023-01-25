import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'
import {LogiCheckboxChange} from '@logi/base/web/ui/checkbox'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-checkbox-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class CheckboxSampleComponent implements OnInit {
    public control = new FormControl('')
    public value = ''
    public ngOnInit(): void {
        this.control.valueChanges.subscribe(val => {
            this.value = val
        })
    }

    // tslint:disable-next-line: prefer-function-over-method
    public onCheckboxChange(change: LogiCheckboxChange): void {
        // tslint:disable-next-line: no-console
        console.log(change.checked)
    }
}
