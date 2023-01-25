import {Pipe, PipeTransform} from '@angular/core'

const enum Growth {
    POSITIVE = 'logi-growth-positive',
    NEGATIVE = 'logi-growth-negative',
}

@Pipe({
    name: 'growthClass',
})
export class GrowthClassPipe implements PipeTransform {
    // tslint:disable-next-line: prefer-function-over-method
    public transform(value: unknown): string {
        if (isNaN(Number(value)))
            return ''
        const num = Number(value)
        if (num === 0)
            return ''
        return num > 0 ? Growth.POSITIVE : Growth.NEGATIVE
    }
}
