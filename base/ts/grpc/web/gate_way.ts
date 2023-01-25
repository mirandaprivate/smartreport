import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'

export interface MethodInfo<Request, Response> {
    readonly method: 'get' | 'post' | 'patch' | 'delete' | 'put'
    readonly url: string
    // tslint:disable-next-line: prefer-method-signature
    readonly responseFromJson: (jsonStr: string) => Response
    // tslint:disable-next-line: prefer-method-signature
    readonly requestToJson: (req: Request, ignoreDefault?: boolean) => string
}

class MethodInfoImpl<Request, Response>
    implements Impl<MethodInfo<Request, Response>> {
    public method!: 'get' | 'post' | 'patch' | 'delete' | 'put'
    public url!: string
    public responseFromJson!: (jsonStr: string) => Response
    public requestToJson!: (req: Request, ignoreDefault?: boolean) => string
}

export class MethodInfoBuilder<Request, Response> extends Builder<
    MethodInfo<Request, Response>,
    MethodInfoImpl<Request, Response>
> {
    public constructor(obj?: Readonly<MethodInfo<Request, Response>>) {
        const impl = new MethodInfoImpl<Request, Response>()
        if (obj)
            MethodInfoBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public method(method: 'get' | 'post' | 'patch' | 'delete' | 'put'): this {
        this.getImpl().method = method
        return this
    }

    public url(url: string): this {
        this.getImpl().url = url
        return this
    }

    public responseFromJson(
        responseFromJson: (jsonStr: string) => Response,
    ): this {
        this.getImpl().responseFromJson = responseFromJson
        return this
    }

    public requestToJson(requestToJson: (req: Request, ignoreDefault?: boolean) => string): this {
        this.getImpl().requestToJson = requestToJson
        return this
    }

    protected get daa(): readonly string[] {
        return MethodInfoBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'method',
        'url',
        'responseFromJson',
        'requestToJson',
    ]
}
