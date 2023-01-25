import {Builder} from '@logi/base/ts/common/builder'

export interface AvatarChange {
    readonly id: string
    readonly url: string
}

class AvatarChangeImpl implements AvatarChange {
    public id!: string
    public url!: string
}

export class AvatarChangeBuilder extends Builder<AvatarChange, AvatarChangeImpl> {
    public constructor(obj?: Readonly<AvatarChange>) {
        const impl = new AvatarChangeImpl()
        if (obj)
            AvatarChangeBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public id(id: string): this {
        this.getImpl().id = id
        return this
    }

    public url(url: string): this {
        this.getImpl().url = url
        return this
    }

    protected get daa(): readonly string[] {
        return AvatarChangeBuilder.__DAA_PROPS__
    }

    protected static readonly __DAA_PROPS__: readonly string[] = [
        'id',
        'url',
    ]
}

export function isAvatarChange(value: unknown): value is AvatarChange {
    return value instanceof AvatarChangeImpl
}

export function assertIsAvatarChange(
    value: unknown
): asserts value is AvatarChange {
    if (!(value instanceof AvatarChangeImpl))
        throw Error('Not a AvatarChange!')
}
