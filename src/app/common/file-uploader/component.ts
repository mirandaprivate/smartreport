import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core'
import {
    readFile,
    readFileToBase64,
    readFileToDataUrl,
} from '@logi/src/app/base/file'
import {isHTMLInputElement} from '@logi/src/app/base/utils'
import {NotificationService} from '@logi/src/app/ui/notification'

const LOAD_FILE_FAILED_MESSAGE = '读取文件失败'

export type ReadAs = 'arrayBuffer' | 'base64' | 'dataUrl'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-file-uploader',
    styleUrls: ['./style.css'],
    templateUrl: './template.html',
})
export class FileUploaderComponent {
    public constructor(
        private readonly _notificationSvc: NotificationService,
    ) {}
    @Output() public readonly file$ = new EventEmitter<File>()
    @Output() public readonly base64$ = new EventEmitter<string>()
    @Output() public readonly dataUrl$ = new EventEmitter<string>()
    @Output() public readonly arrayBuffer$ = new EventEmitter<ArrayBuffer>()
    @Input() public accept = '*'
    @Input() public readAs: ReadAs = 'arrayBuffer'
    @Input() public disabled = false
    @Input() public maxSize?: number

    public onFileChange(e: Event): void {
        const input = e.target
        if (!isHTMLInputElement(input))
            return
        const files = input.files
        if (files === null || files.length === 0)
            return
        const file = files[0]
        const size = file.size / 1024
        if (this.maxSize !== undefined && size > this.maxSize) {
            this._notificationSvc.showError(`文件大小不应大于${this.maxSize}kb`)
            return
        }
        this.file$.next(file)
        /**
         * 在第二次上传相同文件的时候，onFileChange这个方法并不会触发。
         * 是因为在第二次上传相同文件时，input当中的value值没有发生变化，
         * 导致onChange没有触发。解决这个问题办法是：在每次获取完文件对象并且完成一系列操作后，
         * 将事件target.value赋值为空。
         */
        input.value = ''
        switch (this.readAs){
        case 'arrayBuffer':
            this._loadFileAb(file)
            return
        case 'base64':
            this._loadBase64(file)
            return
        case 'dataUrl':
            this._loadDataUrl(file)
            return
        default:
            return
        }
    }

    private _loadBase64(file: File): void {
        readFileToBase64(file).subscribe(u=>{
            if (u === undefined) {
                this._notificationSvc.showError(LOAD_FILE_FAILED_MESSAGE)
                return
            }
            this.base64$.next(u)
        })
    }

    private _loadDataUrl(file: File): void{
        readFileToDataUrl(file).subscribe(u=>{
            if (u === undefined) {
                this._notificationSvc.showError(LOAD_FILE_FAILED_MESSAGE)
                return
            }
            this.dataUrl$.next(u)
        })
    }

    private _loadFileAb(file: File): void {
        readFile(file).subscribe(ab => {
            if (ab === undefined) {
                this._notificationSvc.showError(LOAD_FILE_FAILED_MESSAGE)
                return
            }
            this.arrayBuffer$.next(ab)
        })
    }
}
