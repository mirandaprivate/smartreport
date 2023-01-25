export interface Code {
    readonly template: string
    readonly style: string
    readonly component: string
}

export interface CodeTab {
    readonly title: string
    readonly code: Code
}
