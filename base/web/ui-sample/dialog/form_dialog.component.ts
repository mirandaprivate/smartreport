import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'
import {MatDialogRef} from '@angular/material/dialog'
import {Validators} from '@logi/base/web/base/form'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-form-dialog-sample',
    styleUrls: ['./form_dialog.style.scss'],
    templateUrl: './form_dialog.template.html',
})
export class FormDialogSampleComponent {
    public constructor(
        private readonly _dialogRef: MatDialogRef<FormDialogSampleComponent>,
    ) {}

    public formGroup = new FormGroup({
        password: new FormControl('', [Validators.notEmpty('密码不能为空')]),
        username: new FormControl('', [Validators.notEmpty('用户名不能为空'),
            Validators.email('邮箱格式不正确')]),
    })

    public onCancel(): void {
        this._dialogRef.close()
    }

    public onConfirm(): void {
        this._dialogRef.close()
    }
}
