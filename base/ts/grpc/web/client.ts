import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'
import {AbstractClientBase, Error, GrpcWebClientBase} from 'grpc-web'
import {Observable, Subject} from 'rxjs'

/**
 * Grpc-web client. It uses npm `grpc-web` and can only run in browser.
 * Learn more at https://github.com/grpc/grpc-web.
 */
export interface GrpcClient {
    readonly host: string
    readonly port: number
    call<Request, Response>(
        method: ClientRpcDescriptor<Request, Response>,
    ): Observable<Response>
}

class GrpcClientImpl implements Impl<GrpcClient> {
    public host!: string
    public port!: number
    public call<Request, Response>(
        method: ClientRpcDescriptor<Request, Response>,
    ): Observable<Response> {
        const subject$ = new Subject<Response>()
        const client = new GrpcWebClientBase({format: 'binary'})
        const methodInfo = new AbstractClientBase.MethodInfo<Request, Response>(
            method.responseType,
            method.encodeRequest,
            method.decodeResponse,
        )
        client.rpcCall(
            `${this.host}:${this.port}${method.path}`,
            method.request,
            {},
            methodInfo,
            (err: Error | null, response: Response): void => {
                if (err !== null) {
                    subject$.error(err)
                    return
                }
                subject$.next(response)
                subject$.complete()
            },
        )
        return subject$
    }
}

export class GrpcClientBuilder extends Builder<GrpcClient, GrpcClientImpl> {
    public constructor(obj?: Readonly<GrpcClient>) {
        const impl = new GrpcClientImpl()
        if (obj)
            GrpcClientBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public host(host: string): this {
        this.getImpl().host = host
        return this
    }

    public port(port: number): this {
        this.getImpl().port = port
        return this
    }

    protected get daa(): readonly string[] {
        return GrpcClientBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'host',
        'port',
    ]
}

/**
 * ClientRpcDescriptor contains the necessary information to use `grpc-web`.
 */
export interface ClientRpcDescriptor<Request, Response> {
    /**
     * The path of this rpc. The format is `/{Package}.{ServiceName}/{RpcName}`
     */
    readonly path: string
    /**
     * The repsonse message object constructor.
     */
    readonly responseType: new () => Response
    /**
     * The callback to encode request message.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly encodeRequest: (req: Request) => Uint8Array
    /**
     * The callback to decode response binary.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly decodeResponse: (bytes: Uint8Array) => Response
    /**
     * The request message.
     */
    readonly request: Request
}

class ClientRpcDescriptorImpl<Request, Response>
    implements Impl<ClientRpcDescriptor<Request, Response>> {
    public path!: string
    public responseType!: new () => Response
    public encodeRequest!: (req: Request) => Uint8Array
    public decodeResponse!: (bytes: Uint8Array) => Response
    public request!: Request
}

export class ClientRpcDescriptorBuilder<Request, Response> extends Builder<
    ClientRpcDescriptor<Request, Response>,
    ClientRpcDescriptorImpl<Request, Response>
> {
    public constructor(obj?: Readonly<ClientRpcDescriptor<Request, Response>>) {
        const impl = new ClientRpcDescriptorImpl<Request, Response>()
        if (obj)
            ClientRpcDescriptorBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public path(path: string): this {
        this.getImpl().path = path
        return this
    }

    public responseType(responseType: new () => Response): this {
        this.getImpl().responseType = responseType
        return this
    }

    public encodeRequest(encodeRequest: (req: Request) => Uint8Array): this {
        this.getImpl().encodeRequest = encodeRequest
        return this
    }

    public decodeResponse(
        decodeResponse: (bytes: Uint8Array) => Response,
    ): this {
        this.getImpl().decodeResponse = decodeResponse
        return this
    }

    public request(request: Request): this {
        this.getImpl().request = request
        return this
    }

    protected get daa(): readonly string[] {
        return ClientRpcDescriptorBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'path',
        'responseType',
        'encodeRequest',
        'decodeResponse',
        'request',
    ]
}
