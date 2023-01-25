export function normalizeExcelValue(num: string): string {
    const n = Number(num)
    if (isNaN(n))
        return num
    const absNum = Math.abs(n)
    const formatted = Number(absNum.toFixed(2)).toLocaleString('en-US')
    return n < 0 ? `(${formatted})` : formatted
}

export function isPositiveInteger(value: unknown): boolean {
    if (typeof value !== 'number')
        return false
    return /^\+?([1-9]\d*)$/.test(String(value))
}