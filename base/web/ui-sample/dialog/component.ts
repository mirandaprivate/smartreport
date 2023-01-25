import {ChangeDetectionStrategy, Component} from '@angular/core'
import {AbstractControl, ValidationErrors} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {LOGI_REG_PHNOE} from '@logi/base/web/base/form'
import {
    ActionBuilder,
    ButtonGroupBuilder,
    DialogService,
    InputDialogData,
    InputDialogDataBuilder,
    TextDialogBuilder,
    TextDialogData,
    TextLineBuilder,
    TextSpanBuilder,
    TextSpanType,
} from '@logi/base/web/ui/dialog'
import {Observable, of, timer} from 'rxjs'
import {map} from 'rxjs/operators'

import {FormDialogSampleComponent} from './form_dialog.component'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DialogService],
    selector: 'logi-dialog-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class DialogSampleComponent {
    public constructor(
        private readonly _dialog: MatDialog,
        private readonly _dialogSvc: DialogService,
    ) {}

    public openByMatDialog(): void {
        this._dialog.open(FormDialogSampleComponent, {
            width: '540px',
        })
    }

    // tslint:disable: prefer-function-over-method no-console
    public clickText(): void {
        const dialogData = buildTextDialogData()
        this._dialogSvc.openTextDialog(dialogData, {
            autoFocus: false,
            disableClose: true,
            width: '1040px',
        })
    }

    public clickInput(): void {
        const dialogData = buildInputDialogData(false)
        this._dialogSvc.openInputDialog(dialogData, {
            autoFocus: true,
            disableClose: true,
        })
    }

    public clickInputWithValid(): void {
        const dialogData = buildInputDialogData(true)
        this._dialogSvc.openInputDialog(dialogData, {
            autoFocus: true,
            disableClose: true,
        })
    }
}

function onCancel(): Observable<boolean> {
    console.log('取消')
    return of(true)
}

function onConfirm(): Observable<boolean> {
    console.log('确定')
    // tslint:disable-next-line: no-magic-numbers
    return timer(1000).pipe(map(() => true))
}

function buildTextDialogData(): TextDialogData {
    const buttonGroup = new ButtonGroupBuilder()
        .secondary([new ActionBuilder().text('取消').run(onCancel).build()])
        .primary(new ActionBuilder().text('确定').run(onConfirm).build())
        .build()
    const lines = [
        new TextLineBuilder()
            .spans([
                new TextSpanBuilder()
                    .type(TextSpanType.BASIC)
                    .text('是否在退出前保存对模型的')
                    .build(),
                new TextSpanBuilder()
                    .type(TextSpanType.EMPHASIS)
                    .text('修改？')
                    .build(),
            ])
            .build(),
    ]
    return new TextDialogBuilder()
        .title('退出Logi.Studio')
        .lines(lines)
        .buttonGroup(buttonGroup)
        .build()
}

function buildInputDialogData(hasValid: boolean): InputDialogData {
    const arr = ['15818724337']
    const validRules = {
        phoneNumber: {
            message: '手机号格式不正确',
            validator: (control: AbstractControl): ValidationErrors | null => {
                if (!LOGI_REG_PHNOE.test(control.value))
                    return {phoneNumber: true}
                // tslint:disable-next-line: no-null-keyword
                return null
            },
        },
        sameName: {
            message: '与现有名字重复',
            validator: (control: AbstractControl): ValidationErrors | null => {
                if (arr.includes(control.value))
                    return {sameName: true}
                // tslint:disable-next-line: no-null-keyword
                return null
            },
        },
    }
    const buttonGroup = new ButtonGroupBuilder()
        .secondary([new ActionBuilder().text('取消').run(onCancel).build()])
        .primary(new ActionBuilder().text('确定').run(onConfirm).build())
        .build()
    const build = new InputDialogDataBuilder()
        .title('Dialog')
        .placeholder('placeholder')
        .value('initial value')
        .buttonGroup(buttonGroup)
    if (!hasValid)
        return build.build()
    return build.rules(validRules).build()
}
