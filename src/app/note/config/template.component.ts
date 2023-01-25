import {
    EventEmitter,
    Output,
    OnDestroy,
    Component,
    ChangeDetectorRef,
    Input,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core'
import {
    GetTypesResponse_Type,
    GetTypesResponse_TypeBuilder,
} from '@logi-pb/src/proto/jianda/report_pb'
import {DocActionService} from '@logi/src/app/note/doc'
import {FormControl, FormGroup, FormBuilder} from '@angular/forms'
import {Validators} from '@logi/src/app/base/form'
import {HttpClient} from '@angular/common/http'
import {
    getAllClassifications,
    getAllResearchTypes,
    searchResearch,
} from '@logi/src/http/jianda'
import {EmptyBuilder} from '@logi-pb/src/proto/google/protobuf/empty_pb'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {
    TemplateInfo,
    ResearchSearchRequestBuilder,
    UpdateTemplateInfoRequest,
    UpdateTemplateInfoRequestBuilder,
    UpdateTemplateInfoRequest_ResearchBuilder,
    UpdateTemplateInfoRequest_TypeBuilder,
    ResearchSearchResponse_Research,
    ResearchSearchResponse_ResearchBuilder,
} from '@logi-pb/src/proto/jianda/template_pb'
import {isString} from '@logi/base/ts/common/type_guard'
import {Subscription} from 'rxjs'
import {SelectImpl} from './select'
const TEMPLATE_NAME_KEY = 'templateName'
const RESEARCH_OBJ_KEY = 'researchObj'

@Component({
    selector: 'logi-template-config',
    templateUrl: './template.component.html',
    styleUrls: ['./common.component.scss','./template.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateComponent extends SelectImpl implements OnInit, OnDestroy {
    constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _docActionSvc: DocActionService,
        private readonly _http: HttpClient,
        public readonly formBuilder: FormBuilder,
    ) {
        super()
    }
    @Input() templateInfo!: TemplateInfo
    @Output() readonly update$ = new EventEmitter<UpdateTemplateInfoRequest>()
    group = new FormGroup({
        [TEMPLATE_NAME_KEY]: new FormControl('', [Validators
            .notEmpty('请输入研报名称')]),
        [RESEARCH_OBJ_KEY]: new FormControl(''),
    })
    templateNameFormControl = TEMPLATE_NAME_KEY
    researchObjFormControl = RESEARCH_OBJ_KEY
    currTemplateType?: GetTypesResponse_Type
    currResearchType?: GetTypesResponse_Type
    templateTypes: readonly GetTypesResponse_Type[] = []
    researchTypes: readonly GetTypesResponse_Type[] = []
    researchObjectOptions: readonly ResearchSearchResponse_Research[] = []
    displayFn(c: ResearchSearchResponse_Research): string {
        return c && c.name
    }

    get researchObjOptions(): readonly string[] {
        return this.researchObjectOptions.map(o => o.name)
    }

    ngOnInit(): void {
        this.group.get(TEMPLATE_NAME_KEY)?.setValue(this.templateInfo.title)
        this.currTemplateType = this.templateInfo.type
        this.currResearchType = new GetTypesResponse_TypeBuilder()
            .id(this.templateInfo.research?.typeId ?? '')
            .name(this.templateInfo.research?.typeName ?? '')
            .build()
        this._initClassification()
        this._initResearchTypes()
        this._initSearchObject()
    }

    ngOnDestroy(): void {
        this._searchSub?.unsubscribe()
        this._subs.unsubscribe()
    }

    save(): void {
        if (this.disable())
            return
        const getValue = (name: string) => this.group.get(name)?.value
        const researchObj = getValue(RESEARCH_OBJ_KEY)
        const research = new UpdateTemplateInfoRequest_ResearchBuilder()
            .objectId(researchObj?.id ?? '')
            .objectName(researchObj?.name ?? '')
            .typeId(this.currResearchType?.id ?? '')
            .typeName(this.currResearchType?.name ?? '')
            .build()
        const type = new UpdateTemplateInfoRequest_TypeBuilder()
            .id(this.currTemplateType?.id ?? '')
            .name(this.currTemplateType?.name ?? '')
            .build()
        const req = new UpdateTemplateInfoRequestBuilder()
            .id(this.templateInfo.id)
            .title(getValue(TEMPLATE_NAME_KEY) ?? '')
            .research(research)
            .type(type)
            .build()
        this.update$.next(req)
    }

    disable(): boolean {
        return this.group.invalid
    }

    close(): void {
        this._docActionSvc.closeSidenavPanel()
    }
    private _searchSub?: Subscription
    private _subs = new Subscription()

    private _searchResearch(key: string): void {
        this._searchSub?.unsubscribe()
        const type = this.currResearchType
        if (type === undefined)
            return
        const req = new ResearchSearchRequestBuilder()
            .typeId(type.id)
            .key(key)
            .build()
        this._searchSub = searchResearch(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.researchObjectOptions = res.data
            this._cd.detectChanges()
        })
    }

    private _initClassification() {
        const req = new EmptyBuilder().build()
        getAllClassifications(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.templateTypes = res.data
            this._cd.detectChanges()
        })
    }

    private _initResearchTypes() {
        const req = new EmptyBuilder().build()
        getAllResearchTypes(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.researchTypes = res.data
            this._cd.detectChanges()
        })
    }

    private _initSearchObject() {
        const research = new ResearchSearchResponse_ResearchBuilder()
            .id(this.templateInfo.research?.objectId ?? '')
            .name(this.templateInfo.research?.objectName ?? '')
            .build()
        const researchObj = this.group.get(RESEARCH_OBJ_KEY)
        researchObj?.setValue(research)
        researchObj?.valueChanges.subscribe(key => {
            if (!isString(key))
                return
            this._searchResearch(key)
        })
    }
}
