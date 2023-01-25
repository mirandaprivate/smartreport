export function getApi(url: string): string {
    return `/api/library${url}`
}

export function getInnerApi(url: string): string {
    return url
}
