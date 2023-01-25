import {HttpClient} from '@angular/common/http'
import {
    ReportInfo,
    ReportInfoRequestBuilder,
    ReportTypeEnum,
} from '@logi-pb/src/proto/jianda/report_pb'
import {
    GetTemplateInfoRequestBuilder,
    TemplateInfo,
    TemplateTypeEnum,
} from '@logi-pb/src/proto/jianda/template_pb'
import {DocToPDFRequestBuilder} from '@logi-pb/src/proto/doc/doc_pb'
import {getReportInfo, getTemplateInfo} from '@logi/src/http/jianda'
import {getUint8arrayFromBase64, saveAs} from '@logi/src/app/base/file'
import {FileExtension} from '@logi/src/app/common/wps/params'
import {isHttpErrorResponse} from '@logi/base/ts/common/rpc_call'
import {map} from 'rxjs/operators'
import {docToPDF} from '@logi/src/http/doc'
import {FileTypeEnum} from '@logi-pb/src/proto/jianda/file_pb'

export async function saveNote(
    report: ReportInfo,
    http: HttpClient,
): Promise<boolean> {
    const subfix = report.reportType === ReportTypeEnum.REPORT_TYPE_DOC ?
        FileExtension.WORD.toString() : FileExtension.PPT.toString()
    const req = new ReportInfoRequestBuilder().id(report.id).build()
    const newReport = await getReportInfo(req, http).toPromise()
    if(isHttpErrorResponse(newReport))
        return false
    if (newReport.data === undefined)
        return false
    return http
        .get(newReport.data.downloadUrl, {responseType: 'arraybuffer'})
        .pipe(map(r => {
            const blob = new Blob([r])
            saveAs(blob, `${report.title}${subfix}`)
            return true
        }))
        .toPromise()
}

export async function saveNoteTemplate(
    template: TemplateInfo,
    http: HttpClient,
): Promise<boolean> {
    const subfix = template.templateType === TemplateTypeEnum.TEMPLATE_TYPE_DOC ?
        FileExtension.WORD.toString() : FileExtension.PPT.toString()
    const req = new GetTemplateInfoRequestBuilder().id(template.id).build()
    const newTemplate = await getTemplateInfo(req, http).toPromise()
    if(isHttpErrorResponse(newTemplate))
        return false
    if (newTemplate.data === undefined)
        return false
    return http
        .get(newTemplate.data.downloadUrl, {responseType: 'arraybuffer'})
        .pipe(map(r => {
            const blob = new Blob([r])
            saveAs(blob, `${template.title}${subfix}`)
            return true
        }))
        .toPromise()
}

export async function saveNoteAsPdf(
    report: ReportInfo,
    http: HttpClient,
): Promise<boolean> {
    return await toPdf(
        `${report.title}.pdf`,
        FileTypeEnum.FILE_TYPE_REPORT,
        report.id,
        http
    )
}

export async function saveNoteTemplateAsPdf(
    template: TemplateInfo,
    http: HttpClient,
): Promise<boolean> {
    return await toPdf(
        `${template.title}.pdf`,
        FileTypeEnum.FILE_TYPE_TEMPLATE,
        template.id,
        http
    )
}

async function toPdf(
    // tslint:disable-next-line: max-params
    filename: string,
    fileType: FileTypeEnum,
    id: string,
    http: HttpClient,
): Promise<boolean> {
    const req = new DocToPDFRequestBuilder()
        .fileId(id)
        .fileType(fileType)
        .build()
    const res = await docToPDF(req, http).toPromise()
    if(isHttpErrorResponse(res))
        return false
    const u8 = getUint8arrayFromBase64(res.base64Content)
    const blob = new Blob([u8])
    saveAs(blob, filename)
    return true
}
