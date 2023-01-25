const MAP = new Map<string, string>()

export function set(k: string, v: string): void {
    MAP.set(k, v)
}

export function get(k: string): string | undefined {
    return MAP.get(k)
}
