import {
    Output,
    EventEmitter,
    Component,
    ChangeDetectorRef,
    Input,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core'
import {
    ReportInfo,
    GetTypesResponse_Type,
    PermTypeEnum,
    ReportInfoUpdateRequestBuilder,
    PermBuilder,
    ReportInfoUpdateRequest,
    GetAllReportTypesRequestBuilder,
    ReportTagsRequestBuilder,
    GetTypesResponse_TypeBuilder,
} from '@logi-pb/src/proto/jianda/report_pb'
import {DocActionService} from '@logi/src/app/note/doc'
import {FormControl} from '@angular/forms'
import {Validators} from '@logi/src/app/base/form'
import {HttpClient} from '@angular/common/http'
import {
    getAllReportTags,
    getAllReportTypes,
    getAllTypes,
    getReadAvailableUsers,
    getUser,
    getWriteAvailableUsers,
} from '@logi/src/http/jianda'
import {EmptyBuilder} from '@logi-pb/src/proto/google/protobuf/empty_pb'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {LogiRadioChange} from '@logi/src/app/ui/radio'
import {
    GetAvailableUsersRequestBuilder,
    GetAvailableUsersResponse_User,
    UserInfoRequestBuilder,
} from '@logi-pb/src/proto/jianda/user_pb'
import {SelectImpl} from './select'
import {getValue, setValue} from './form-control'

@Component({
    selector: 'logi-config',
    templateUrl: './config.component.html',
    styleUrls: ['./common.component.scss','./config.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent extends SelectImpl implements OnInit {
    constructor(
        private readonly _cd: ChangeDetectorRef,
        private readonly _docActionSvc: DocActionService,
        private readonly _http: HttpClient,
    ) {
        super()
    }
    @Input() reportInfo!: ReportInfo
    @Output() readonly reportInfo$ = new EventEmitter<ReportInfoUpdateRequest>()
    loading = true
    permTypeEnum = PermTypeEnum
    reportNameFormControl = new FormControl('', [Validators
        .notEmpty('请输入研报名称')])
    readersOptions: readonly GetAvailableUsersResponse_User[] = []
    readersFormControl = new FormControl()
    writersOptions: readonly GetAvailableUsersResponse_User[] = []
    writersFormControl = new FormControl()
    classifications: readonly GetTypesResponse_Type[] = []
    types: readonly GetTypesResponse_Type[] = []
    tags: readonly GetTypesResponse_Type[] = []
    currClassification?: GetTypesResponse_Type
    currType?: GetTypesResponse_Type
    currTags: readonly GetTypesResponse_Type[] = []
    readerSelectValues: readonly GetTypesResponse_Type[] = []
    writerSelectValues: readonly GetTypesResponse_Type[] = []
    normalPerms = [
        PermTypeEnum.PERM_TYPE_SELF,
        PermTypeEnum.PERM_TYPE_DEPARTMENT,
        PermTypeEnum.PERM_TYPE_BU,
        PermTypeEnum.PERM_TYPE_ALL,
    ] as const
    ngOnInit(): void {
        setValue(this.reportNameFormControl, this.reportInfo.title)
        const readPerm = this.reportInfo.readPerm
        if (readPerm === undefined)
            setValue(this.readersFormControl, PermTypeEnum.PERM_TYPE_CUSTOM)
        else
            setValue(this.readersFormControl, readPerm.type)
        const writePerm = this.reportInfo.writePerm
        if (writePerm === undefined)
            setValue(this.writersFormControl, PermTypeEnum.PERM_TYPE_CUSTOM)
        else
            setValue(this.writersFormControl, writePerm.type)
        this.currClassification = this.reportInfo.classification
        this.currType = this.reportInfo.type
        this.currTags = this.reportInfo.tags
        this._initReaders()
        this._initWriters()
        this._initClassifications()
        this._initTags()
        this._initTypes()
    }

    searchTag(key: string) {
        this._initTags(key)
    }

    classificationChange(classification: GetTypesResponse_Type): void {
        this.currClassification = classification
        this._initTypes()
    }

    readSelectValueChanged(values: readonly GetTypesResponse_Type[]): void {
        this.readerSelectValues = values
    }

    writeSelectValueChanged(values: readonly GetTypesResponse_Type[]): void {
        this.writerSelectValues = values
    }

    writersChanged(changed: LogiRadioChange<PermTypeEnum>): void {
        const value = changed.value
        if (value !== PermTypeEnum.PERM_TYPE_CUSTOM || this.writersOptions.length !== 0)
            return
        const req = new GetAvailableUsersRequestBuilder()
            .reportId(this.reportInfo.id)
            .build()
        getWriteAvailableUsers(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.writersOptions = res.data
            this._cd.detectChanges()
        })
    }

    readersChanged(changed: LogiRadioChange<PermTypeEnum>): void {
        const value = changed.value
        if (value !== PermTypeEnum.PERM_TYPE_CUSTOM || this.readersOptions.length !== 0)
            return
        const req = new GetAvailableUsersRequestBuilder()
            .reportId(this.reportInfo.id)
            .build()
        getReadAvailableUsers(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.readersOptions = res.data
            this._cd.detectChanges()
        })
    }

    close(): void {
        this._docActionSvc.closeSidenavPanel()
    }

    save(): void {
        const readPerm = getValue<PermTypeEnum>(this.readersFormControl)
        const rp = new PermBuilder()
            .type(readPerm ?? PermTypeEnum.PERM_TYPE_UNSPECIFIED)
        if (readPerm === PermTypeEnum.PERM_TYPE_CUSTOM) {
            const ids = this.readerSelectValues.map(r => r.id)
            rp.customUsersId(ids)
        }
        const writePerm = getValue<PermTypeEnum>(this.writersFormControl)
        const wp = new PermBuilder()
            .type(writePerm ?? PermTypeEnum.PERM_TYPE_UNSPECIFIED)
        if (writePerm === PermTypeEnum.PERM_TYPE_CUSTOM) {
            const ids = this.writerSelectValues.map(r => r.id)
            wp.customUsersId(ids)
        }
        const req = new ReportInfoUpdateRequestBuilder()
            .id(this.reportInfo.id)
            .title(this.reportNameFormControl.value)
            .readPerm(rp.build())
            .tags(this.currTags)
            .writePerm(wp.build())
        if (this.currClassification !== undefined)
            req.classification(this.currClassification)
        if (this.currType !== undefined)
            req.type(this.currType)
        this.reportInfo$.next(req.build())
    }

    private _initWriters() {
        const perm = this.reportInfo.writePerm
        const ids = perm?.customUsersId ?? []
        if (ids.length === 0 || perm?.type !== PermTypeEnum.PERM_TYPE_CUSTOM)
            return
        const req = new UserInfoRequestBuilder().ids(ids).build()
        getUser(req, this._http).subscribe(res => {
            const data = isHttpErrorResponse(res) ? [] : res.data
            this.writerSelectValues = data
                .map(d => new GetTypesResponse_TypeBuilder()
                    .id(d.id)
                    .name(d.fullName)
                    .build())
        })
    }

    private _initReaders() {
        const perm = this.reportInfo.readPerm
        const ids = perm?.customUsersId ?? []
        if (ids.length === 0 || perm?.type !== PermTypeEnum.PERM_TYPE_CUSTOM)
            return
        const req = new UserInfoRequestBuilder().ids(ids).build()
        getUser(req, this._http).subscribe(res => {
            const data = isHttpErrorResponse(res) ? [] : res.data
            this.readerSelectValues = data
                .map(d => new GetTypesResponse_TypeBuilder()
                    .id(d.id)
                    .name(d.fullName)
                    .build())
        })
    }

    private _initClassifications(): void {
        const req = new EmptyBuilder().build()
        getAllTypes(req, this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.classifications = res.data
            this._cd.detectChanges()
        })
    }

    private _initTypes(): void {
        const req = new GetAllReportTypesRequestBuilder()
        if (this.currClassification)
            req.node(this.currClassification.id)
        getAllReportTypes(req.build(), this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.types = res.data
            this._cd.detectChanges()
        })
    }

    private _initTags(key?: string): void {
        const req = new ReportTagsRequestBuilder()
        if (key)
            req.q(key)
        getAllReportTags(req.build(), this._http).subscribe(res => {
            if (isHttpErrorResponse(res))
                return
            this.tags = res.data
            this._cd.detectChanges()
        })
    }
}
