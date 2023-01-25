// tslint:disable: no-localstorage no-type-assertion
export function set(key: string, value: string | number): void {
    localStorage.setItem(key, value.toString())
}

export function get(key: string): string | undefined {
    const value = localStorage.getItem(key)
    if (value === null)
        return
    return value
}

export function length(): number {
    return localStorage.length
}

export function remove(key: string): void {
    return localStorage.removeItem(key)
}

export function clear(): void {
    localStorage.clear()
}
