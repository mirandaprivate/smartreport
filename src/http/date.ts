import {ItemDataFreqEnum} from '@logi-pb/src/proto/jianda/data_pb'
import {getQuarter} from '@logi/src/app/base/date/month'

/**
 * T4059
 */
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_WEEK_MS = 7 * ONE_DAY_MS
export function getDistanceByDates(
    curr: Date,
    selected: Date,
    freq: ItemDataFreqEnum,
): number {
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_DAY) {
        const getDates = (d: Date) => Math.round(d.getTime() / ONE_DAY_MS)
        return getDates(selected) - getDates(curr)
    }
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_MONTH) {
        const getMonths = (d: Date) => (d.getFullYear() - 1) * 12 + d.getMonth()
        return getMonths(selected) - getMonths(curr)
    }
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_QUARTER) {
        const getQuarters = (d: Date) => getQuarter(d.toString())
            + (d.getFullYear() - 1) * 4
        return getQuarters(selected) - getQuarters(curr)
    }
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_WEEK) {
        const getWeeks = (d: Date) => Math.round(d.getTime() / ONE_WEEK_MS)
        return getWeeks(selected) - getWeeks(curr)
    }
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_YEAR)
        return selected.getFullYear() - curr.getFullYear()
    return 0
}

/**
 * T4059
 */
export function getDateByDistance(
    curr: Date,
    distance: number,
    freq: ItemDataFreqEnum,
): Date {
    let current = new Date(curr)
    if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_DAY)
        current.setDate(current.getDate() + distance)
    else if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_MONTH) {
        current.setDate(1)
        current.setMonth(current.getMonth() + distance + 1)
        current = new Date(current.getTime() - ONE_DAY_MS)
    }
    else if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_QUARTER) {
        const getQuarters = (d: Date) => getQuarter(d.toString())
            + (d.getFullYear() - 1) * 4
        const distanceQuarter = getQuarters(current) + distance
        const year = Math.ceil(distanceQuarter / 4)
        const quarter = distanceQuarter % 4
        const quarterMap = new Map([
            [1, `${year}-03-31`],
            [2, `${year}-06-30`],
            [3, `${year}-09-30`],
            [0, `${year}-12-31`],
        ])
        current = new Date(quarterMap.get(quarter) ?? new Date())
    }
    else if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_WEEK) {
        const targetTime = curr.getTime() + distance * ONE_WEEK_MS
        const target = new Date(targetTime)
        const offset = 5 - target.getDay()
        current = new Date(target.getTime() + offset * ONE_DAY_MS)
    }
    else if (freq === ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_YEAR) {
        const year = current.getFullYear() + distance
        current = new Date(`${year}-12-31`)
    }
    return current
}

export function formatDate(date: string): string {
    const d = getDate(date)
    return `${d.getFullYear()}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${(d.getDate()).toString().padStart(2, '0')}`
}

export function getDate(date: string | number): Date {
    const num = Number(date)
    if (isNaN(num))
        return new Date(date)
    return new Date(num)
}
