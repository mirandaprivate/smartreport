import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'growthText',
})
export class GrowthTextPipe implements PipeTransform {
    // tslint:disable-next-line: prefer-function-over-method
    public transform(value: unknown, precision = 2, percent = true): string {
        if (isNaN(Number(value)))
            return '-'
        const num = Number(value)
        let result = num.toString()
        const p = percent ? '%' : ''
        if (percent)
            result = (num * 100).toString()
        result = Number(result).toFixed(precision)
        if (num === 0)
            return num.toString()
        return num > 0 ? `${result}${p}` : `(${Math.abs(Number(result))}${p})`
    }
}
