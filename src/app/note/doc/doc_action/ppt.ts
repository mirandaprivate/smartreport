import {DocAction, SaveResult} from './base'

export class PptDocAction extends DocAction {
    public async save(): Promise<SaveResult> {
        return await this.wpsApp.ActivePresentation.Save()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async insertText(): Promise<void> {
    }
}
