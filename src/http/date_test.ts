import {getDistanceByDates, getDateByDistance} from './date'
import {ItemDataFreqEnum} from '@logi-pb/src/proto/jianda/data_pb'
const DAY = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_DAY
const MONTH = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_MONTH
const QUARTER = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_QUARTER
const WEEK = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_WEEK
const YEAR = ItemDataFreqEnum.ITEM_DATA_DATE_FREQ_YEAR

describe('calcDistanceByDates test', () => {
    const today = new Date('2021-08-30')
    it('day', () => {
        const selected1 = new Date('2021-08-30')
        const distance1 = getDistanceByDates(today, selected1, DAY)
        expect(distance1).toBe(0)
        const selected2 = new Date('2021-09-01')
        const distance2 = getDistanceByDates(today, selected2, DAY)
        expect(distance2).toBe(2)
    })
    it('month', () => {
        const selected1 = new Date('2021-08-08')
        const distance1 = getDistanceByDates(today, selected1, MONTH)
        expect(distance1).toBe(0)
        const selected2 = new Date('2021-10-16')
        const distance2 = getDistanceByDates(today, selected2, MONTH)
        expect(distance2).toBe(2)
    })
    it('quarter', () => {
        const selected1 = new Date('2021-07-30')
        const distance1 = getDistanceByDates(today, selected1, QUARTER)
        expect(distance1).toBe(0)
        const selected2 = new Date('2022-02-01')
        const distance2 = getDistanceByDates(today, selected2, QUARTER)
        expect(distance2).toBe(2)
    })
    it('week', () => {
        const selected1 = new Date('2021-09-01')
        const distance1 = getDistanceByDates(today, selected1, WEEK)
        expect(distance1).toBe(0)
        const selected2 = new Date('2021-09-17')
        const distance2 = getDistanceByDates(today, selected2, WEEK)
        expect(distance2).toBe(2)
    })
    it('year', () => {
        const selected1 = new Date('2021-08-27')
        const distance1 = getDistanceByDates(today, selected1, YEAR)
        expect(distance1).toBe(0)
        const selected2 = new Date('2023-09-10')
        const distance2 = getDistanceByDates(today, selected2, YEAR)
        expect(distance2).toBe(2)
    })
})

describe('getDateByDistance test', () => {
    const today = new Date('2021-08-31')
    it('day', () => {
        const selected1 = getDateByDistance(today, 0, DAY)
        expect(formatDate(selected1)).toBe('2021-08-31')
        const selected2 = getDateByDistance(today, 2, DAY)
        expect(formatDate(selected2)).toBe('2021-09-02')
    })
    it('month', () => {
        const selected1 = getDateByDistance(today, 0, MONTH)
        expect(formatDate(selected1)).toBe('2021-08-31')
        const selected2 = getDateByDistance(today, 2, MONTH)
        expect(formatDate(selected2)).toBe('2021-10-31')
    })
    it('quarter', () => {
        const selected1 = getDateByDistance(today, 0, QUARTER)
        expect(formatDate(selected1)).toBe('2021-09-30')
        const selected2 = getDateByDistance(today, 2, QUARTER)
        expect(formatDate(selected2)).toBe('2022-03-31')
    })
    it('week', () => {
        const selected1 = getDateByDistance(today, 0, WEEK)
        expect(formatDate(selected1)).toBe('2021-09-03')
        const selected2 = getDateByDistance(today, 2, WEEK)
        expect(formatDate(selected2)).toBe('2021-09-17')
    })
    it('year', () => {
        const selected1 = getDateByDistance(today, 0, YEAR)
        expect(formatDate(selected1)).toBe('2021-12-31')
        const selected2 = getDateByDistance(today, 2, YEAR)
        expect(formatDate(selected2)).toBe('2023-12-31')
    })
})
function formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${date.getFullYear()}-${month}-${d}`
}
