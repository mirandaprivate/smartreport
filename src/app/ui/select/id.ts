let ID = 0
const KEY = 'LOGI_SELECT_OPTION_INTERNAL_KEY'
export function getId(): string {
    return `${KEY}${ID++}`
}

// tslint:disable-next-line: unknown-paramenter-for-type-predicate
export function isArray<T>(obj: T | readonly T[]): obj is readonly T[] {
    return Array.isArray(obj)
}