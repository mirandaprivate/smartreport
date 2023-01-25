import {HttpClient} from '@angular/common/http'
import {TemplateInfo} from '@logi-pb/src/proto/jianda/template_pb'
import {ReportInfo, isReportInfo} from '@logi-pb/src/proto/jianda/report_pb'
import {
    saveNote,
    saveNoteAsPdf,
    saveNoteTemplate,
    saveNoteTemplateAsPdf,
} from '@logi/src/app/common/http'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WpsApp = any
export type SaveResult = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly error?: any
    readonly result: 'ok' | 'nochange' | 'SavedEmptyFile' | 'SpaceFull' | 'QueneFull' | 'fail'
}

// tslint:disable: blank-line-between-functions
export abstract class DocAction {
    public constructor(
        protected readonly http: HttpClient,
        protected readonly wpsApp: WpsApp,
        protected readonly fileId: string,
    ) {}
    // tslint:disable-next-line: async-promise
    public abstract save(): Promise<SaveResult>
    public abstract insertText(text: string): void
    public async exportAsWord(
        content: ReportInfo | TemplateInfo
    ): Promise<boolean> {
        return isReportInfo(content) ?
            saveNote(content, this.http) :
            saveNoteTemplate(content, this.http)
    }
    public async exportAsPdf(
        content: ReportInfo | TemplateInfo
    ): Promise<boolean> {
        return isReportInfo(content) ?
            saveNoteAsPdf(content, this.http) :
            saveNoteTemplateAsPdf(content, this.http)
    }
}
