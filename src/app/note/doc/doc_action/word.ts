import {DocAction, SaveResult} from './base'

export class WordDocAction extends DocAction {
    public async save(): Promise<SaveResult> {
        return await this.wpsApp.ActiveDocument.Save()
    }

    public async insertText(text: string): Promise<void> {
        await this.wpsApp.ActiveDocument.ActiveWindow.Selection
            .InsertAfter(text)
    }

    public async insertParagragh(): Promise<void> {
        await this.wpsApp.ActiveDocument.ActiveWindow.Selection
            .InsertParagraph()
    }
}
