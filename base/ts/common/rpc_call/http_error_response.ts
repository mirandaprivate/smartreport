import {Builder} from '@logi/base/ts/common/builder'
import {Impl} from '@logi/base/ts/common/mapped_types'
export interface HttpErrorResponse {
    // 返回码
    readonly status: number
    // 错误信息
    readonly message: string
    // 接口url
    readonly url: string
}

class HttpErrorResponseImpl implements Impl<HttpErrorResponse> {
    public status!: number
    public message = ''
    public url!: string
}

export class HttpErrorResponseBuilder extends Builder<HttpErrorResponse, HttpErrorResponseImpl> {
    public constructor(obj?: Readonly<HttpErrorResponse>) {
        const impl = new HttpErrorResponseImpl()
        if (obj)
            HttpErrorResponseBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public status(status: number): this {
        this.getImpl().status = status
        return this
    }

    public message(message: string): this {
        this.getImpl().message = message
        return this
    }

    public url(url: string): this {
        this.getImpl().url = url
        return this
    }

    protected get daa(): readonly string[] {
        return HttpErrorResponseBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = ['status', 'url']
}

export function isHttpErrorResponse(
    value: unknown,
): value is HttpErrorResponse {
    return value instanceof HttpErrorResponseImpl
}

export function assertIsHttpErrorResponse(
    value: unknown,
): asserts value is HttpErrorResponse {
    if (!(value instanceof HttpErrorResponseImpl))
        throw Error('Not a HttpErrorResponse!')
}
