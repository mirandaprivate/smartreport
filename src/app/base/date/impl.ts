// tslint:disable-next-line: no-wildcard-import
import * as Long from 'long'

export function getTime(m: Long | null | undefined): string {
    if (m === undefined)
        return '-'
    if (m === null)
        return '-'
    if (m.lessThanOrEqual(0))
        return '-'
    /**
     * 1s = 1000ms
     */
    // tslint:disable-next-line: no-magic-numbers
    const multi = 1000
    const s = m.toNumber() * multi
    const date = new Date(s)
    const year = date.toISOString().split('T')[0]
    const time = date.toTimeString().split(' ')[0]
    return `${year}` + ` ${time}`
}

export function moreThan(time1: string, time2: string): boolean {
    const date1 = new Date(time1)
    const date2 = new Date(time2)
    if (date1.getFullYear() > date2.getFullYear())
        return true
    if (date1.getMonth() > date2.getMonth())
        return true
    if (date1.getDate() > date2.getDate())
        return true
    return false
}
