// tslint:disable: no-unnecessary-method-declaration no-console
// tslint:disable: prefer-function-over-method
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {
    LogiSelectChange,
    LogiSelectSize,
    VirtualScrollItem,
} from '@logi/base/web/ui/select'
import {Subscription} from 'rxjs'

import {NAME_LIST, USER_GROUP_LIST, USER_LIST} from '../_data/index'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-select-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class SelectSampleComponent implements OnInit {
    public options1 = NAME_LIST
    public options2 = USER_LIST
    public groupList1 = USER_GROUP_LIST
    public selected = 'Sherry'
    public disabled = false
    public formControl = new FormControl('', [Validators.required])
    size: LogiSelectSize = 'default'
    public virtualScrollItems: readonly VirtualScrollItem<number>[] =
        Array(10000).fill(0).map((_, i) => {
            return {
                value: i,
                label: `item${i}`,
            }
        })

    public ngOnInit(): void {
        this.formControl.setValue('Ralap')
        this._subs.add(this.formControl.valueChanges.subscribe(value => {
            console.log(`form control value change: ${value}`)
        }))
    }

    public toggleDisabled(): void {
        this.disabled = !this.disabled
    }

    public onSelectChange(event: LogiSelectChange): void {
        console.log(event)
    }

    // tslint:disable-next-line: unknown-instead-of-any
    public onValueChange(value: any): void {
        console.log(value)
    }

    public onClickPanelAction(): void {
        console.log('panel action click')
    }

    private readonly _subs = new Subscription()
}
