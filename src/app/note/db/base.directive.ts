import {createPlaceholder} from '@logi/src/http/jianda'
import {InsertEvent} from '@logi/src/app/insert'
import {
    CreatePlaceholderRequestBuilder,
    ItemDataTypeEnum,
} from '@logi-pb/src/proto/jianda/data_pb'
import {
    Directive,
    OnInit,
    Input,
    Injector,
    ChangeDetectorRef,
} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {
    DataListResponse_Table,
    isItemDataDesc,
    ItemDataDesc,
    DataListTypeEnum,
    DataListRequestBuilder,
    DataListResponse_Source,
} from '@logi-pb/src/proto/jianda/data_pb'
import {dataList} from '@logi/src/http/jianda'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {NoteNavButtonId} from '../sidenav'
import {NotificationService} from '@logi/src/app/ui/notification'
import {DocActionService} from '@logi/src/app/note/doc'

@Directive({
    selector: '[logi-db-base-base]',
})
// tslint:disable-next-line: ext-variable-name naming-convention
class _BaseDirective implements OnInit {
    constructor(public readonly injector: Injector) {
        this.cd = injector.get(ChangeDetectorRef)
        this.http = injector.get(HttpClient)
        this.notificationSvc = injector.get(NotificationService)
        this.docActionSvc = injector.get(DocActionService)
    }
    @Input() researchId = ''
    @Input() researchName = ''
    @Input() noteNavId!: NoteNavButtonId
    cd: ChangeDetectorRef
    http: HttpClient
    docActionSvc: DocActionService
    notificationSvc: NotificationService
    loadDatabase = true
    currSource!: DataListResponse_Source
    sources: readonly DataListResponse_Source[] = []
    currItem?: ItemDataDesc

    ngOnInit(): void {
        this._initItemList()
    }

    closePanel(): void {
        this.docActionSvc.closeSidenavPanel()
    }

    itemChange(item: ItemDataDesc | DataListResponse_Table): void {
        if (!isItemDataDesc(item))
            return
        this.currItem = item
    }

    onSourceChange(value: string): void {
        const source = this.sources.find(r => r.name === value)
        if (source === undefined)
            return
        this.currSource = source
        this.cd.detectChanges()
    }

    private _initItemList(): void {
        this.loadDatabase = true
        this.cd.markForCheck()
        let type = DataListTypeEnum.DATA_LIST_TYPE_UNSPECIEFIED
        if (this.noteNavId === NoteNavButtonId.NUMBER)
            type = DataListTypeEnum.DATA_LIST_TYPE_NUMBER
        else if (this.noteNavId === NoteNavButtonId.TEXT)
            type = DataListTypeEnum.DATA_LIST_TYPE_TEXT
        else if (this.noteNavId === NoteNavButtonId.GRAPH)
            type = DataListTypeEnum.DATA_LIST_TYPE_PICTURE
        else
            return
        const req = new DataListRequestBuilder()
            .researchId(this.researchId)
            .type(type)
            .build()
        dataList(req, this.http).subscribe(e => {
            this.loadDatabase = false
            this.cd.markForCheck()
            if (isHttpErrorResponse(e)) {
                this.notificationSvc.showError(e.message)
                return
            }
            this.sources = e.data
            this.currSource = this.sources[0]
        })
    }
}

@Directive({
    selector: '[logi-db-base]',
})
export class BaseDirective extends _BaseDirective {
    constructor(public readonly injector: Injector) {
        super(injector)
    }

    onInsert(e: InsertEvent): void {
        if (e.value.value === undefined) {
            this.docActionSvc.insertText('')
            return
        }
        const text = e.value.value.getValue()?.[0].toString() ?? ''
        if (e.placeholderDesc.dataType === ItemDataTypeEnum.ITEM_DATA_TYPE_TEXT && e.value.newLine) {
            this._insertParagragh(text)
            return
        }
        this.docActionSvc.insertText(text)
    }

    private _insertParagragh(text: string): void {
        const texts = text.split('\n')
        const docAction = this.docActionSvc.getWordDocAction()
        if (docAction === undefined)
            return
        texts.forEach(t => {
            docAction.insertText(t)
            docAction.insertParagragh()
        })
    }
}

@Directive({
    selector: '[logi-db-template-base]',
})
export class TemplateBaseDirective extends _BaseDirective {
    constructor(public readonly injector: Injector) {
        super(injector)
    }

    onInsert(e: InsertEvent): void {
        const text = e.getEncodedPlaceholderDesc()
        const req = new CreatePlaceholderRequestBuilder().text(text).build()
        createPlaceholder(req, this.http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            if (res.data === '')
                return
            const id = res.data
            if (e.placeholderDesc.dataType === ItemDataTypeEnum.ITEM_DATA_TYPE_TEXT && e.value.newLine) {
                this._insertParagragh(id)
                return
            }
            const text = `{{${id}}}`
            this.docActionSvc.insertText(text)
        })
    }

    private _insertParagragh(id: string): void {
        const docAction = this.docActionSvc.getWordDocAction()
        if (docAction === undefined)
            return
        docAction.insertText(`{{#${id}}}`)
        docAction.insertText('{{text}}')
        docAction.insertParagragh()
        docAction.insertText(`{{/${id}}}`)
    }
}
