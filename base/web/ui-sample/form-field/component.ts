// tslint:disable: no-magic-numbers
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'
import {
    LOGI_PWD_CONFIRM_FORM_CONTROL_NAME,
    LOGI_PWD_FORM_CONTROL_NAME,
    LOGI_REG_SIMPLE_PWD,
    Validators,
} from '@logi/base/web/base/form'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FormBuilder],
    selector: 'logi-form-field-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class FormFieldSampleComponent {
    public constructor(private readonly _fb: FormBuilder) {}

    public disabled = false
    public formControl = new FormControl('123', [Validators
        .maxLength(6, '最长6位')])
    public pwdControlName = LOGI_PWD_FORM_CONTROL_NAME
    public pwdConfirmControlName = LOGI_PWD_CONFIRM_FORM_CONTROL_NAME

    public formGroup: FormGroup = this._fb.group(
        {
            [LOGI_PWD_FORM_CONTROL_NAME]: ['', [
                Validators.notEmpty('密码不能为空'),
                Validators.minLength(6, '密码至少6位'),
                Validators.pattern(LOGI_REG_SIMPLE_PWD, '密码格式不正确'),
            ]],
            [LOGI_PWD_CONFIRM_FORM_CONTROL_NAME]: ['', [
                Validators.minLength(6, '密码至少6位'),
            ]],
            user: ['', [
                Validators.notEmpty('用户名不能为空'),
                Validators.minLength(6, '用户名至少6位'),
            ]],
        },
        {validators: Validators.passwordMatch('密码不一致')},
    )

    public toggleDisabled(): void {
        toggleControlDisabled(this.formControl)
    }
}

function toggleControlDisabled(control: FormControl): void {
    control.disabled ? control.enable() : control.disable()
}
