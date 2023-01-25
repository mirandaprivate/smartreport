// tslint:disable: no-unnecessary-method-declaration no-console
// tslint:disable: prefer-function-over-method no-magic-numbers
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'
import {SliderValue} from '@logi/base/web/ui/slider'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-slider-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class SliderSampleComponent implements OnInit {
    public disabled = false
    public singleValue1: SliderValue = 30
    public rangeValue1: SliderValue = [20, 50]
    public singleValue2: SliderValue = 40
    public sliderControl1 = new FormControl(this.singleValue2)
    public rangeValue2: SliderValue = [30, 80]
    public sliderControl2 = new FormControl(this.rangeValue2)
    public singleValue3: SliderValue = 30
    public rangeValue3: SliderValue = [40, 60]
    public tooltipFormatter?: (v: number) => string
    public quartersRange = yearQuartersRange(2010, 2014)
    public rangeValue4: SliderValue = [4, 6]
    public rangeValue4Label = this._mapValueToQuarter(this.rangeValue4)
    public yearQuarterFormatter = (v: number) => this.quartersRange[v] || ''

    public ngOnInit(): void {
        this.sliderControl1.valueChanges.subscribe(value => {
            this.singleValue2 = value
        })
        this.sliderControl2.valueChanges.subscribe(value => {
            this.rangeValue2 = value
        })
    }

    public toggleDisable(): void {
        this.disabled = !this.disabled
    }

    public toggleTooltip(): void {
        if (this.tooltipFormatter === undefined) {
            this.tooltipFormatter = (value: number) => `${value}元`
            return
        }
        this.tooltipFormatter = undefined
    }

    public onQuartersChange(value: SliderValue): void {
        this.rangeValue4Label = this._mapValueToQuarter(value)
    }

    private _mapValueToQuarter(value: SliderValue): readonly string [] {
        if (!Array.isArray(value))
            return []
        return [this.quartersRange[value[0]], this.quartersRange[value[1]]]
    }
}

function yearQuartersRange(
    startYear: number,
    endYear: number,
): readonly string[] {
    if (endYear < startYear)
        return []
    const quartersRange: number[] = [1, 2, 3, 4]
    return Array
        .from(Array(endYear - startYear).keys())
        .map(v => v + startYear)
        .map(y =>
         quartersRange.map(q => `${y}Q${q}`),
    )
        .reduce((p, n) => p.concat(n), [])
}
