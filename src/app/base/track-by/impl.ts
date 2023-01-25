// tslint:disable: ext-variable-name naming-convention unknown-instead-of-any
/**
 * TODO(minglong): Why can not set unknown but any.
 */
export function trackByFnReturnItem(_: number, item: any): any {
    return item
}

export function trackByFnReturnIndex(index: number, _: any): number {
    return index
}
