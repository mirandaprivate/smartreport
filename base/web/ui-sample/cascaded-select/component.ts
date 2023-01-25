// tslint:disable: no-unnecessary-method-declaration no-console
// tslint:disable: prefer-function-over-method
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {
    CascadedSelectChange,
    CascadedSelectOption,
    CascadedSelectOptionBuilder,
} from '@logi/base/web/ui/cascaded-select'

interface City {
    readonly name: string
}

const HUBEI: City = {name: 'Hubei'}
const WUHAN: City = {name: 'Wuhan'}
const YICHANG: City = {name: 'Yichang'}
const GUANGDONG: City = {name: 'Guangdong'}
const SHENZHEN: City = {name: 'Shenzhen'}
const NANSHAN: City = {name: 'Nanshan'}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-cascaded-select-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class CascadedSelectSampleComponent implements OnInit {
    public options: readonly CascadedSelectOption[] = mockYearOptions()
    public options1: readonly CascadedSelectOption[] = mockCityOptions()
    public options2: readonly CascadedSelectOption[] = mockCityOptions1()
    public selectedValue = ''
    public initValue: readonly string[] = ['Guangdong', 'Guangzhou']
    public initValue1: readonly City[] = [GUANGDONG, SHENZHEN, NANSHAN]

    public ngOnInit(): void {
    }

    public onChange(event: CascadedSelectChange): void {
        this.selectedValue = event.options.map(o => o.label).join('')
    }

    public onChange1(event: readonly string[]): void {
        this.initValue = event
    }

    public onChange2(event: readonly City[]): void {
        this.initValue1 = event
    }
}

// tslint:disable: no-magic-numbers
function mockYearOptions(): readonly CascadedSelectOption[] {
    return Array.from(Array(20).keys()).map(i => i + 2010).map(y => {
        const quarters = Array
            // tslint:disable-next-line: insecure-random
            .from(Array(Math.floor(Math.random() * 4) + 1).keys())
            .map(e => `Q${e + 1}`)
        const children = quarters.map(q => new CascadedSelectOptionBuilder()
            .value(q)
            .build())
        return new CascadedSelectOptionBuilder()
            .value(y)
            .children(children)
            .build()
    })
}

function mockCityOptions(): readonly CascadedSelectOption[] {
    return [
        new CascadedSelectOptionBuilder()
            .value('Hubei')
            .children([
                new CascadedSelectOptionBuilder()
                    .value('Wuhan')
                    .children([
                        new CascadedSelectOptionBuilder()
                            .value('Hankou')
                            .build(),
                    ])
                    .build(),
                new CascadedSelectOptionBuilder().value('Yichang').build(),
            ])
            .build(),
        new CascadedSelectOptionBuilder()
            .value('Guangdong')
            .children([
                new CascadedSelectOptionBuilder()
                    .value('Shenzhen')
                    .children([
                        new CascadedSelectOptionBuilder()
                            .value('Nanshan')
                            .build(),
                        new CascadedSelectOptionBuilder()
                            .value('Baoan')
                            .build(),
                    ])
                    .build(),
                new CascadedSelectOptionBuilder().value('Guangzhou').build(),
            ])
            .build(),
    ]
}

/**
 * Option的值为对象的情况
 */
function mockCityOptions1(): readonly CascadedSelectOption[] {
    return [
        new CascadedSelectOptionBuilder()
            .value(HUBEI)
            .label(HUBEI.name)
            .children([
                new CascadedSelectOptionBuilder()
                    .value(WUHAN)
                    .label(WUHAN.name)
                    .build(),
                new CascadedSelectOptionBuilder()
                    .value(YICHANG)
                    .label(YICHANG.name)
                    .build(),
            ])
            .build(),
        new CascadedSelectOptionBuilder()
            .value(GUANGDONG)
            .label(GUANGDONG.name)
            .children([
                new CascadedSelectOptionBuilder()
                    .value(SHENZHEN)
                    .label(SHENZHEN.name)
                    .children([
                        new CascadedSelectOptionBuilder()
                            .value(NANSHAN)
                            .label(NANSHAN.name)
                            .build(),
                    ])
                    .build(),
            ])
            .build(),
    ]
}
