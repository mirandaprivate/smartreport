import {Component, ChangeDetectionStrategy, Inject} from '@angular/core'
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
export interface MoreData {
    readonly date: string
    readonly text: string
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-text-more',
    templateUrl: './more.component.html',
    styleUrls: ['./more.component.scss'],
})
export class TextMoreComponent {
    constructor(
        private readonly _dialogRef: MatDialogRef<TextMoreComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly data: MoreData,
    ) {
        this.texts = data.text.split('\n')
    }
    texts: readonly string[] = []
    close(): void {
        this._dialogRef.close()
    }
}
