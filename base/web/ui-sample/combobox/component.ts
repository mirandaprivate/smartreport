// tslint:disable: prefer-function-over-method no-console no-magic-numbers
// tslint:disable: no-unnecessary-method-declaration unknown-instead-of-any
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core'
import {FormControl} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {Validators} from '@logi/base/web/base/form'
import {LogiComboboxSize} from '@logi/base/web/ui/combobox'
import {timer} from 'rxjs'

import {NAME_LIST, USER_GROUP_LIST, USER_LIST} from '../_data/index'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-combobox-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ComboboxSampleComponent implements OnInit {
    constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _dialog: MatDialog,
    ) {}
    public options1 = NAME_LIST
    public options2 = USER_LIST
    public groupList1 = USER_GROUP_LIST
    public disabled = false
    public dataPreparing = true
    public lazyOptions: readonly string[] = []
    public formControl1 = new FormControl(['Sherry', 'Ralap'], [
        Validators.notEmpty('不能为空'),
    ])
    size: LogiComboboxSize = 'default'

    ngOnInit(): void {
        this.formControl1.valueChanges.subscribe(value => console.log(value))
        timer(5000).subscribe(() => {
            this._cd.markForCheck()
            this.dataPreparing = false
            this.lazyOptions = ['111', '222']
        })
    }

    toggleDisabled(): void {
        this.disabled = !this.disabled
    }

    onValueChange(value: any): void {
        console.log(value)
    }

    clickAction(): void {
        this._dialog.open(PanelDialogComponent)
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-combobox-panel-dialog',
    // tslint:disable-next-line: template-i18n
    template: '<div mat-dialog-close>close</div>',
})
export class PanelDialogComponent {}
