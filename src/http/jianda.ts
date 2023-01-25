import {HttpClient} from '@angular/common/http'
import {
    GetTypesResponse,
    ReportInfoRequest,
    ReportInfoResponse,
    ReportInfoUpdateRequest,
    ReportInfoUpdateResponse,
    SensitiveWordListRequest,
    SensitiveWordListResponse,
    GetAllReportTypesRequest,
    ReportTagsRequest,
} from '@logi-pb/src/proto/jianda/report_pb'
import {Empty} from '@logi-pb/src/proto/google/protobuf/empty_pb'
import {
    GetTemplateInfoRequest,
    GetTemplateInfoResponse,
    ResearchSearchRequest,
    ResearchSearchResponse,
    UpdateTemplateInfoRequest,
} from '@logi-pb/src/proto/jianda/template_pb'
import {
    GetAvailableUsersRequest,
    GetAvailableUsersResponse,
    UserInfoRequest,
    UserInfoResponse,
} from '@logi-pb/src/proto/jianda/user_pb'
import {
    CreatePlaceholderRequest,
    CreatePlaceholderResponse,
    DataListRequest,
    DataListResponse,
    DataSeriesValueRequest,
    DataSeriesValueResponse,
    DataValueRequest,
    DataValueResponse,
    GetPlaceholderRequest,
    GetPlaceholderResponse,
} from '@logi-pb/src/proto/jianda/data_pb'
import {
    FileInfoRequest,
    FileInfoResponse,
    GetFileVersionHistoryRequest,
    GetFileVersionHistoryResponse,
    GetFileVersionInfoRequest,
    SaveFileRequest,
    SaveFileResponse,
} from '@logi-pb/src/proto/jianda/file_pb'
import {JiandaSvcGateWay} from '@logi-pb/src/proto/jianda/rpc_grpc_web'
import {HttpErrorResponse, rpcCall} from '@logi/base/ts/common/rpc_call'
import {Observable} from 'rxjs'

import {getApi} from './get_api'

export function getAllResearchTypes(
    req: Empty,
    http: HttpClient,
): Observable<GetTypesResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_ALL_RESEARCH_TYPES, http, getApi)
}

export function searchResearch(
    req: ResearchSearchRequest,
    http: HttpClient,
): Observable<ResearchSearchResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.SEARCH_RESEARCH, http, getApi)
}

export function getUser(
    req: UserInfoRequest,
    http: HttpClient,
): Observable<UserInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_USER, http, getApi)
}

export function getReportInfo(
    req: ReportInfoRequest,
    http: HttpClient,
): Observable<ReportInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_REPORT_INFO, http, getApi)
}

export function reportInfoUpdate(
    req: ReportInfoUpdateRequest,
    http: HttpClient,
): Observable<ReportInfoUpdateResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.REPORT_INFO_UPDATE, http, getApi)
}

export function getSensitiveWords(
    req: SensitiveWordListRequest,
    http: HttpClient,
): Observable<SensitiveWordListResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_SENSITIVE_WORDS, http, getApi)
}

export function getReadAvailableUsers(
    req: GetAvailableUsersRequest,
    http: HttpClient,
): Observable<GetAvailableUsersResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_READ_AVAILABLE_USERS, http, getApi)
}

export function getWriteAvailableUsers(
    req: GetAvailableUsersRequest,
    http: HttpClient,
): Observable<GetAvailableUsersResponse | HttpErrorResponse> {
    return rpcCall(
        req,
        JiandaSvcGateWay.GET_WRITE_AVAILABLE_USERS,
        http,
        getApi
    )
}

export function getAllTypes(
    req: Empty,
    http: HttpClient,
): Observable<GetTypesResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_ALL_TYPES, http, getApi)
}

export function getAllClassifications(
    req: Empty,
    http: HttpClient,
): Observable<GetTypesResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_ALL_CLASSIFICATIONS, http, getApi)
}

export function getAllReportTypes(
    req: GetAllReportTypesRequest,
    http: HttpClient,
): Observable<GetTypesResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_ALL_REPORT_TYPES, http, getApi)
}

export function getAllReportTags(
    req: ReportTagsRequest,
    http: HttpClient,
): Observable<GetTypesResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_ALL_REPORT_TAGS, http, getApi)
}

export function getTemplateInfo(
    req: GetTemplateInfoRequest,
    http: HttpClient,
): Observable<GetTemplateInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_TEMPLATE_INFO, http, getApi)
}

export function updateTemplateInfo(
    req: UpdateTemplateInfoRequest,
    http: HttpClient,
): Observable<GetTemplateInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.UPDATE_TEMPLATE_INFO, http, getApi)
}

export function dataList(
    req: DataListRequest,
    http: HttpClient,
): Observable<DataListResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.DATA_LIST, http, getApi)
}

export function dataSeriesValue(
    req: DataSeriesValueRequest,
    http: HttpClient,
): Observable<DataSeriesValueResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.DATA_SERIES_VALUE, http, getApi)
}

export function dataValue(
    req: DataValueRequest,
    http: HttpClient,
): Observable<DataValueResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.DATA_VALUE, http, getApi)
}

export function createPlaceholder(
    req: CreatePlaceholderRequest,
    http: HttpClient,
): Observable<CreatePlaceholderResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.CREATE_PLACEHOLDER, http, getApi)
}

export function getPlaceholder(
    req: GetPlaceholderRequest,
    http: HttpClient,
): Observable<GetPlaceholderResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_PLACEHOLDER, http, getApi)
}

export function getFileInfo(
    req: FileInfoRequest,
    http: HttpClient,
): Observable<FileInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_FILE_INFO, http, getApi)
}

export function saveFile(
    req: SaveFileRequest,
    http: HttpClient,
): Observable<SaveFileResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.SAVE_FILE, http, getApi)
}

export function getFileVersionInfo(
    req: GetFileVersionInfoRequest,
    http: HttpClient,
): Observable<FileInfoResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_FILE_VERSION_INFO, http, getApi)
}

export function getFileVersionHistory(
    req: GetFileVersionHistoryRequest,
    http: HttpClient,
): Observable<GetFileVersionHistoryResponse | HttpErrorResponse> {
    return rpcCall(req, JiandaSvcGateWay.GET_FILE_VERSION_HISTORY, http, getApi)
}
