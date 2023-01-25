import {Pipe, PipeTransform} from '@angular/core'
import {ItemDataFreqEnum} from '@logi-pb/src/proto/jianda/data_pb'

@Pipe({name: 'logiFreq'})
export class FreqPipe implements PipeTransform {
    transform = freqPipe
}

export function freqPipe(freq: ItemDataFreqEnum): string {
    const map = new Map([
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_DAY, '日'],
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_MONTH, '月'],
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_QUARTER, '季度'],
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_UNSPECIEFIED, ''],
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_WEEK, '周'],
        [ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_YEAR, '年'],
    ])
    return map.get(freq) ?? ''
}
