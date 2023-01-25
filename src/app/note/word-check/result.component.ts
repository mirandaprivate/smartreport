import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core'
import {isHTMLElement} from '@logi/src/app/base/utils'
import {Subscription} from 'rxjs'

import {SensitiveWordLevelEnum, CountedWord, WpsApp} from './word_checker_core'
import {WordCheckService} from './word-check.service'

type WpsWordLocation = {
    readonly pos: number
    readonly len: number
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-word-check-result',
    styleUrls: ['./result.style.scss'],
    templateUrl: './result.template.html',
})
export class WorkCheckResultComponent implements OnInit, OnDestroy {
    public constructor(
        private readonly _wordCheckSvc: WordCheckService,
        private readonly _cd: ChangeDetectorRef,
    ) {}
    @Input() public set type(type: SensitiveWordLevelEnum) {
        // TODO(zengkai): Remove this switch.
        switch(type) {
        case SensitiveWordLevelEnum.SENSITIVE_LEVEL_ERROR:
            this.color = '#B40014'
            this.label = '违规'
            this.typeClass = 'error-word-tag'
            break
        case SensitiveWordLevelEnum.SENSITIVE_LEVEL_WARN:
            this.color = '#E59035'
            this.label = '危险'
            this.typeClass = 'warn-word-tag'
            break
        default:
        }
    }
    @Input() public words: readonly CountedWord[] = []
    @Input() public wpsApp!: WpsApp

    public color = 'black'
    public label = '未知类型'
    public typeClass = ''

    public ngOnInit(): void {
        this._subs.add(this._wordCheckSvc.getSelectedWord().subscribe(() => {
            this._cd.markForCheck()
        }))
    }

    public ngOnDestroy(): void {
        this.wpsApp = null
        this._wordCheckSvc.selectWord(null)
        this._wordIndexMap.clear()
        this._wordIndexMap.clear()
        this._subs.unsubscribe()
    }

    public getWordCount(word: CountedWord): number {
        const cached = this._wordResultMap.get(word.text)
        if (cached)
            return cached.length
        return word.count
    }

    public getIndexStep(word: CountedWord): string {
        const index = this._wordIndexMap.get(word.text)
        const result = this._wordResultMap.get(word.text)
        if (index === undefined || !result)
            return `${word.count}`
        return `${result.length ? index + 1 : 0}/${result.length}`
    }

    public async onClickGoto(word: string, next: boolean): Promise<void> {
        const index = this._wordIndexMap.get(word)
        if (index === undefined)
            return
        const result = this._wordResultMap.get(word)
        if (!result)
            return
        const changeIndex = next ? index + 1 : index - 1
        if (result[changeIndex] === undefined)
            return
        this._wordIndexMap.set(word, changeIndex)
        await this._goToWordLocation(result[changeIndex])
        this._cd.markForCheck()
    }

    public onClickWord(word: string, e: MouseEvent): void {
        if (!isHTMLElement(e.currentTarget))
            return
        e.currentTarget.focus()
        this._selectWord(word)
    }

    public isWordSelected(word: string): boolean {
        return this._wordCheckSvc.getSelectedWord().value === word
    }

    private _subs = new Subscription()
    private _wordResultMap = new Map<string, readonly WpsWordLocation[]>()
    private _wordIndexMap = new Map<string, number>()

    private async _selectWord(word: string): Promise<void> {
        this._wordCheckSvc.selectWord(word)
        const result = await this.wpsApp.ActiveDocument.Find.Execute(word, true)
        this._cd.markForCheck()
        if (result.length && result.length === 0)
            return
        this._wordResultMap.set(word, result)
        this._wordIndexMap.set(word, 0)
        await this._goToWordLocation(result[0])
    }

    private async _goToWordLocation(loc: WpsWordLocation): Promise<void> {
        await Promise.resolve().then(() => {
            const docRange = this.wpsApp.ActiveDocument.Range(
                loc.pos,
                loc.pos + loc.len,
            )
            this.wpsApp.ActiveDocument.ActiveWindow.ScrollIntoView(docRange)
        })
    }
}
