import {
    ChangeDetectionStrategy,
    EventEmitter,
    OnInit,
    Input,
    Output,
    Component,
} from '@angular/core'
import {isPositiveInteger} from '@logi/src/app/base/utils'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-goto',
    styleUrls: ['./style.css'],
    templateUrl: './template.html',
})
export class GotoComponent implements OnInit {
    @Input() public set total(total: number) {
        this._total = total
        this.currIndex = 1
    }

    public get total(): number {
        return this._total
    }
    @Output() public readonly prev$= new EventEmitter<number>()
    @Output() public readonly next$= new EventEmitter<number>()

    public currIndex = 1
    public ngOnInit(): void {
        if (!isPositiveInteger(this.total))
            // tslint:disable-next-line: no-throw-unless-asserts
            throw Error('The total of logi-goto must be positive integer.')
    }

    // tslint:disable: ng-no-get-and-set-property
    public get prevDisabled(): boolean {
        return this.currIndex === 1
    }

    public get nextDisabled(): boolean {
        return this.currIndex === this.total
    }

    public onClickPrev(): void {
        if (this.prevDisabled || this.currIndex === 1)
            return
        this.currIndex -= 1
        this.prev$.next(this.currIndex)
    }

    public onClickNext(): void {
        if (this.nextDisabled || this.currIndex === this.total)
            return
        this.currIndex += 1
        this.next$.next(this.currIndex)
    }
    private _total!: number
}
