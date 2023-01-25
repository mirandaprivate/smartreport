import {Builder} from '@logi/base/ts/common/builder'

// tslint:disable-next-line: const-enum
export enum NoteNavButtonId {
    NUMBER,
    TEXT,
    GRAPH,
    CONFIG,
    SENSITIVE_WORD,
}

export interface NoteNavButton {
    readonly id: NoteNavButtonId
    readonly icon: string
    readonly label: string
    readonly disabled: boolean
    disable(): void
}

class NoteNavButtonImpl implements NoteNavButton {
    public id!: NoteNavButtonId
    public icon!: string
    public label!: string
    public disabled = false
    public disable(): void {
        this.disabled = true
    }
}

export class NoteNavButtonBuilder extends Builder<NoteNavButton, NoteNavButtonImpl> {
    public constructor(obj?: Readonly<NoteNavButton>) {
        const impl = new NoteNavButtonImpl()
        if (obj)
            NoteNavButtonBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public id(id: NoteNavButtonId): this {
        this.getImpl().id = id
        return this
    }

    public icon(icon: string): this {
        this.getImpl().icon = icon
        return this
    }

    public label(label: string): this {
        this.getImpl().label = label
        return this
    }

    public disabled(disabled: boolean): this {
        this.getImpl().disabled = disabled
        return this
    }

    protected get daa(): readonly string[] {
        return NoteNavButtonBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'id',
        'icon',
        'label',
    ]
}

export function isNoteNavButton(value: unknown): value is NoteNavButton {
    return value instanceof NoteNavButtonImpl
}

export function assertIsNoteNavButton(
    value: unknown
): asserts value is NoteNavButton {
    if (!(value instanceof NoteNavButtonImpl))
        throw Error('Not a NoteNavButton!')
}
