// tslint:disable: no-magic-numbers
import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Validators as LogiValidators} from '@logi/base/web/base/form'
import {ActiveInputService} from '@logi/base/web/ui/input'

import {NAME_LIST} from '../_data/index'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FormBuilder],
    selector: 'logi-input-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class InputSampleComponent implements AfterViewInit {
    public constructor(
        private readonly _activeInputSvc: ActiveInputService,
        private readonly _fb: FormBuilder,
    ) {}
    disabled = false
    public selectInputOptions: readonly string[] = NAME_LIST
    public dropdownSelectInputOptions: readonly string[] = [
        '10',
        '20',
        '40',
        '60',
        '80',
        '100',
        '150',
        '200',
    ]

    public formControlA = new FormControl('foo', [
        Validators.required,
        Validators.email,
    ])

    /**
     * Create a disabled form control.
     * You can also call `disable()` of a FormControl to disable it after
     * created.
     */
    public formControlC = new FormControl({
        disabled: true,
        value: '禁用状态',
    }, [Validators.required, Validators.email])

    public formControlB = new FormControl('test', [
        Validators.required,
        Validators.email,
    ])

    public formControlD = new FormControl('带有前缀图标', [
        Validators.required,
        Validators.email,
    ])

    textareaControl = new FormControl('', [
        LogiValidators.maxLength(100, '字数不能超过100'),
    ])

    public formGroupA: FormGroup = this._fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        username: ['', [Validators.required, Validators.email]],
    })
    public formGroupB = new FormGroup({
        name: new FormControl('', [Validators.required]),
    })

    public selectInputControl = new FormControl('Page Hume')
    public disabledSelectInputControl = new FormControl({value: '禁用', disabled: true})
    public searchSelectInputControl = new FormControl('')
    public dropdownSelectInputControl = new FormControl('60')

    public ngAfterViewInit(): void {
        this.formControlA.valueChanges.subscribe(v => {
            // tslint:disable: no-console
            console.log(v)
        })
        this.selectInputControl.valueChanges.subscribe(value => {
            console.log(`select input value change from control: ${value}`)
        })
    }

    toggleDisabled(): void {
        this.disabled = !this.disabled
        this.disabled ? this.textareaControl.disable() :
            this.textareaControl.enable()
    }

    // tslint:disable-next-line: prefer-function-over-method
    public onSelectInputValueChange(value: string): void {
        console.log(`select input value change from itself: ${value}`)
    }

    // tslint:disable: naming-convention
    public getInputAError(): string | undefined {
        if (this.formControlA.hasError('required'))
            return '不能为空'
        if (this.formControlA.hasError('email'))
            return '格式不正确'
        return
    }

    public getInputBError(): string | undefined {
        if (this.formControlB.hasError('required'))
            return '不能为空'
        if (this.formControlB.hasError('email'))
            return '格式不正确'
        return
    }

    public getUsernameError(): string | undefined {
        // tslint:disable: no-backbone-get-set-outside-model
        if (this.formGroupA.get('username')?.hasError('required'))
            return '邮箱不能为空'
        if (this.formGroupA.get('username')?.hasError('email'))
            return '邮箱格式不正确'
        return
    }

    public getPasswordError(): string | undefined {
        if (this.formGroupA.get('password')?.hasError('required'))
            return '密码不能为空'
        if (this.formGroupA.get('password')?.hasError('minlength'))
            return '密码长度至少6位'
        return
    }

    public getFGBError(): string {
        if (this.formGroupB.get('name')?.hasError('required'))
            return '名称不能为空'
        return ''
    }

    public onSetActiveInputValue(): void {
        this._activeInputSvc.setActiveInputValue(
            Math.random().toString(36).substring(7),
        )
    }
}
