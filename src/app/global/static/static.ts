const STATIC_PREFIX = ''

export function getStatic(path: string): string {
    return `${STATIC_PREFIX}/${path}`
}
