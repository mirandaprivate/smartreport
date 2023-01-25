import {ChangeDetectionStrategy, Component} from '@angular/core'

// tslint:disable: unknown-instead-of-any
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-button-toggle-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ButtonToggleSampleComponent {
    public defaultValue = '港股'

    // tslint:disable-next-line: no-unnecessary-method-declaration
    public onValueChange(value: any): void {
        console.log(value)
    }
}
