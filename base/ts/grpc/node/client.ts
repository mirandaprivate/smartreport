import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'
import {Client, credentials, ServiceError} from 'grpc'
import {Observable, Subject} from 'rxjs'

/**
 * A grpc client, you can use it to call rpc.
 * TODO(zecheng): Support TLS.
 */
export interface GrpcClient {
    readonly host: string
    readonly port: number
    call<RequestMessage, ResponseMessage>(
        method: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
    ): Observable<ResponseMessage>
}

class GrpcClientImpl implements Impl<GrpcClient> {
    public host!: string
    public port!: number

    public call<RequestMessage, ResponseMessage>(
        rpcDesc: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
    ): Observable<ResponseMessage> {
        const client = new Client(
            `${this.host}: ${this.port}`,
            credentials.createInsecure(),
        )
        if (!rpcDesc.clientStream && !rpcDesc.serverStream)
            return getUnaryResponse(client, rpcDesc)
        if (!rpcDesc.clientStream && rpcDesc.serverStream)
            return getServerStreamResponse(client, rpcDesc)
        if (rpcDesc.clientStream && !rpcDesc.serverStream)
            return getClientStreamResponse(client, rpcDesc)
        return getBidiStreamResponse(client, rpcDesc)
    }
}

function getUnaryResponse<RequestMessage, ResponseMessage>(
    client: Client,
    rpcDesc: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
): Observable<ResponseMessage> {
    // tslint:disable-next-line: no-type-assertion
    const reqMsg = rpcDesc.reqMsg as RequestMessage
    const subject$ = new Subject<ResponseMessage>()
    client.makeUnaryRequest(
        rpcDesc.path,
        rpcDesc.encodeRequest,
        rpcDesc.decodeResponse,
        reqMsg,
        // tslint:disable: no-null-keyword
        null,
        null,
        (error: ServiceError | null, value?: ResponseMessage): void => {
            if (value === undefined) {
                subject$.error(error)
                return
            }
            subject$.next(value)
            subject$.complete()
            client.close()
        },
    )
    return subject$
}

function getServerStreamResponse<RequestMessage, ResponseMessage>(
    client: Client,
    rpcDesc: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
): Observable<ResponseMessage> {
    // tslint:disable-next-line: no-type-assertion
    const reqMsg = rpcDesc.reqMsg as RequestMessage
    const subject$ = new Subject<ResponseMessage>()
    const stream = client.makeServerStreamRequest(
        rpcDesc.path,
        rpcDesc.encodeRequest,
        rpcDesc.decodeResponse,
        reqMsg,
    )
    stream.on('data', (res: ResponseMessage): void => {
        subject$.next(res)
    })
    stream.on('end', (): void => {
        subject$.complete()
        client.close()
    })
    stream.on('error', (e: Error): void => {
        subject$.error(e)
    })
    return subject$
}

function getClientStreamResponse<RequestMessage, ResponseMessage>(
    client: Client,
    rpcDesc: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
): Observable<ResponseMessage> {
    // tslint:disable-next-line: no-type-assertion
    const reqMsgObs = rpcDesc.reqMsg as Observable<RequestMessage>
    const subject$ = new Subject<ResponseMessage>()
    const stream = client.makeClientStreamRequest(
        rpcDesc.path,
        rpcDesc.encodeRequest,
        rpcDesc.decodeResponse,
        null,
        null,
        (error: ServiceError | null, value?: ResponseMessage): void => {
            if (value === undefined) {
                subject$.error(error)
                return
            }
            subject$.next(value)
            subject$.complete()
            client.close()
        },
    )
    reqMsgObs.subscribe(
        (reqMsg: RequestMessage): void => {
            stream.write(reqMsg)
        },
        // tslint:disable-next-line: no-empty
        (): void => {},
        (): void => {
            stream.end()
        },
    )
    return subject$
}

function getBidiStreamResponse<RequestMessage, ResponseMessage>(
    client: Client,
    rpcDesc: ClientRpcDescriptor<RequestMessage, ResponseMessage>,
): Observable<ResponseMessage> {
    // tslint:disable-next-line: no-type-assertion
    const reqMsgObs = rpcDesc.reqMsg as Observable<RequestMessage>
    const subject$ = new Subject<ResponseMessage>()
    const stream = client.makeBidiStreamRequest(
        rpcDesc.path,
        rpcDesc.encodeRequest,
        rpcDesc.decodeResponse,
    )
    stream.on('data', (res: ResponseMessage): void => {
        subject$.next(res)
    })
    stream.on('end', (): void => {
        subject$.complete()
        client.close()
    })
    stream.on('error', (e: Error): void => {
        subject$.error(e)
    })
    reqMsgObs.subscribe(
        (reqMsg: RequestMessage): void => {
            stream.write(reqMsg)
        },
        // tslint:disable-next-line: no-empty
        (): void => {},
        (): void => {
            stream.end()
        },
    )
    return subject$
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
 * ClientRpcDescriptor describes a client rpc, including the path, the way to
 * encode/decode and the request mesaage.
 */
export interface ClientRpcDescriptor<RequestMessage, ResponseMessage> {
    /**
     * The path of this rpc. The format is `/{Package}.{ServiceName}/{RpcName}`
     */
    readonly path: string
    /**
     * The callback to decode the response binary.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly decodeResponse: (data: Buffer) => ResponseMessage
    /**
     * The callback to encode the request message.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly encodeRequest: (req: RequestMessage) => Buffer
    /**
     * The request message.
     */
    readonly reqMsg: RequestMessage | Observable<RequestMessage>
    /**
     * Whether the client uses a stream.
     */
    readonly clientStream: boolean
    /**
     * Whether the server uses a steram.
     */
    readonly serverStream: boolean
}

class ClientRpcDescriptorImpl<RequestMessage, ResponseMessage>
    implements ClientRpcDescriptor<RequestMessage, ResponseMessage> {
    public path!: string
    public decodeResponse!: (data: Buffer) => ResponseMessage
    public encodeRequest!: (req: RequestMessage) => Buffer
    public reqMsg!: RequestMessage | Observable<RequestMessage>
    public clientStream!: boolean
    public serverStream!: boolean
}

export class ClientRpcDescriptorBuilder<RequestMessage, ResponseMessage>
    extends Builder<ClientRpcDescriptor<RequestMessage, ResponseMessage>,
        ClientRpcDescriptorImpl<RequestMessage, ResponseMessage>> {
    public constructor(
        obj?: Readonly<ClientRpcDescriptor<RequestMessage, ResponseMessage>>,
    ) {
        const impl =
            new ClientRpcDescriptorImpl<RequestMessage, ResponseMessage>()
        if (obj)
            ClientRpcDescriptorBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public path(path: string): this {
        this.getImpl().path = path
        return this
    }

    public decodeResponse(
        decodeResponse: (data: Buffer) => ResponseMessage,
    ): this {
        this.getImpl().decodeResponse = decodeResponse
        return this
    }

    public encodeRequest(encodeRequest: (req: RequestMessage) => Buffer): this {
        this.getImpl().encodeRequest = encodeRequest
        return this
    }

    public reqMsg(reqMsg: RequestMessage | Observable<RequestMessage>): this {
        this.getImpl().reqMsg = reqMsg
        return this
    }

    public clientStream(clientStream: boolean): this {
        this.getImpl().clientStream = clientStream
        return this
    }

    public serverStream(serverStream: boolean): this {
        this.getImpl().serverStream = serverStream
        return this
    }

    protected get daa(): readonly string[] {
        return ClientRpcDescriptorBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'path',
        'decodeResponse',
        'encodeRequest',
        'reqMsg',
        'clientStream',
        'serverStream',
    ]
}
