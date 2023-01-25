import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'
import {
    handleBidiStreamingCall,
    handleCall,
    handleClientStreamingCall,
    handleServerStreamingCall,
    handleUnaryCall,
    MethodDefinition,
    sendUnaryData,
    Server,
    ServerDuplexStream,
    ServerReadableStream,
    ServerUnaryCall,
    ServerWritableStream,
    ServiceError,
    status,
} from 'grpc'
import {Observable, of, Subject} from 'rxjs'
import {take} from 'rxjs/operators'

import {GrpcException, isGrpcException} from './lib'

/**
 * ServerRpcDescriptor describes a server rpc, including the path, the way to
 * encode/decode and the handler callback funtion.
 */
export interface ServerRpcDescriptor<RequestMessage, ResponseMessage> {
    /**
     * The path of this rpc. The format is `/{Package}.{ServiceName}/{RpcName}`
     */
    readonly path: string
    /**
     * The callback to decode the response binary.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly decodeRequest: (requestBin: Buffer) => RequestMessage
    /**
     * The callback to encode the request message.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly encodeResponse: (response: ResponseMessage) => Buffer
    /**
     * The implementation function.
     */
    // tslint:disable-next-line: prefer-method-signature
    readonly handle: HandleCall<RequestMessage, ResponseMessage>
    /**
     * Whether the client uses a stream.
     */
    readonly clientStream: boolean
    /**
     * Whether the server uses a steram.
     */
    readonly serverStream: boolean
}

class ServerRpcDescriptorImpl<RequestMessage, ResponseMessage>
    implements Impl<ServerRpcDescriptor<RequestMessage, ResponseMessage>> {
    public path!: string
    public decodeRequest!: (requestBin: Buffer) => RequestMessage
    public encodeResponse!: (response: ResponseMessage) => Buffer
    public handle!: HandleCall<RequestMessage, ResponseMessage>
    public clientStream = false
    public serverStream = false
}

export class ServerRpcDescriptorBuilder<RequestMessage, ResponseMessage>
    extends Builder<
    ServerRpcDescriptor<RequestMessage, ResponseMessage>,
    ServerRpcDescriptorImpl<RequestMessage, ResponseMessage>
> {
    public constructor(
        obj?: Readonly<ServerRpcDescriptor<RequestMessage, ResponseMessage>>,
    ) {
        const impl =
            new ServerRpcDescriptorImpl<RequestMessage, ResponseMessage>()
        if (obj)
            ServerRpcDescriptorBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public path(path: string): this {
        this.getImpl().path = path
        return this
    }

    public decodeRequest(
        decodeRequest: (requestBin: Buffer) => RequestMessage,
    ): this {
        this.getImpl().decodeRequest = decodeRequest
        return this
    }

    public encodeResponse(
        encodeResponse: (response: ResponseMessage) => Buffer,
    ): this {
        this.getImpl().encodeResponse = encodeResponse
        return this
    }

    public handle(handle: HandleCall<RequestMessage, ResponseMessage>): this {
        this.getImpl().handle = handle
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
        return ServerRpcDescriptorBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        'path',
        'decodeRequest',
        'encodeResponse',
        'clientStream',
        'serverStream',
    ]
}

export type HandleCall<Request, Response> =
    UnaryCall<Request, Response> |
    ServerStreamingCall<Request, Response> |
    ClientStreamingCall<Request, Response> |
    BidiStreamingCall<Request, Response>

export type UnaryCall<Request, Response> =
    ((req: Request) => Response | GrpcException) |
    ((req: Request) => Observable<Response | GrpcException>)

export type ClientStreamingCall<Request, Response> =
    (req: Observable<Request>) => Observable<Response | GrpcException>

export type ServerStreamingCall<Request, Response> =
    (req: Request) => Observable<Response | GrpcException>

export type BidiStreamingCall<Request, Response> =
    (req: Observable<Request>) => Observable<Response | GrpcException>

export function registerService<Request, Response>(
    server: Server,
    descMap: Map<string, ServerRpcDescriptor<Request, Response>>,
): void {
    const service = {}
    const impls = {}
    // tslint:disable-next-line: max-func-body-length
    descMap.forEach((v: ServerRpcDescriptor<Request, Response>): void => {
        const methodDef: MethodDefinition<Request, Response> = {
            path: v.path,
            requestDeserialize: v.decodeRequest,
            requestSerialize: () => Buffer.from([]),
            requestStream: v.clientStream,
// tslint:disable-next-line: no-type-assertion no-object-literal-type-assertion
            responseDeserialize: () => ({} as Response),
            responseSerialize: v.encodeResponse,
            responseStream: v.serverStream,
        }
        Reflect.set(service, v.path, methodDef)
        let impl: handleCall<Request, Response>
        // tslint:disable: no-null-keyword
        if (!v.serverStream && !v.clientStream) {
            // tslint:disable-next-line: no-type-assertion
            const handle = v.handle as UnaryCall<Request, Response>
            impl = getUnaryImpl(handle)
        } else if (v.serverStream && !v.clientStream) {
            // tslint:disable-next-line: no-type-assertion
            const handle = v.handle as ServerStreamingCall<Request, Response>
            impl = getServerStreamingImpl(handle)
        } else if (!v.serverStream && v.clientStream) {
            // tslint:disable-next-line: no-type-assertion
            const handle = v.handle as ClientStreamingCall<Request, Response>
            impl = getClientStreamImpl(handle)
        } else {
            // tslint:disable-next-line: no-type-assertion
            const handle = v.handle as BidiStreamingCall<Request, Response>
            impl = getBidiStreamImpl(handle)
        }
        Reflect.set(impls, v.path, impl)
    })
    server.addService(service, impls)
}

function getUnaryImpl<Request, Response>(
    handle: UnaryCall<Request, Response>,
): handleUnaryCall<Request, Response> {
    return (
        call: ServerUnaryCall<Request>,
        callback: sendUnaryData<Response>,
    ): void => {
        // tslint:disable-next-line: no-try
        try {
            const res = handle(call.request)
            const ob = res instanceof Observable ? res : of(res)
            ob.pipe(take(1)).subscribe(
                (response: Response | GrpcException): void => {
                    if (!isGrpcException(response)) {
                        callback(null, response)
                        return
                    }
                    const error = getServiceError(response)
                    callback(error, null)
                    logError(error)
                },
                (error: Error): void => {
                    logError(error)
                    callback(error, null)
                },
            )
        // tslint:disable-next-line: unknown-instead-of-any
        } catch (e: any) {
            logError(e)
            callback(e, null)
        }
    }
}

function getServerStreamingImpl<Request, Response>(
    handle: ServerStreamingCall<Request, Response>,
): handleServerStreamingCall<Request, Response> {
    return (call: ServerWritableStream<Request, Response>): void => {
        // tslint:disable-next-line: no-try
        try {
            handle(call.request).subscribe(
                (response: Response | GrpcException): void => {
                    if (!isGrpcException(response)) {
                        call.write(response)
                        return
                    }
                    const error = getServiceError(response)
                    logError(error)
                    call.emit('error', error)
                },
                (error: Error): void => {
                    logError(error)
                    call.emit('error', error)
                },
                (): void => {
                    call.end()
                },
            )
        // tslint:disable-next-line: unknown-instead-of-any
        } catch (e: any) {
            logError(e)
            call.emit('error', e)
        }
    }
}

function getClientStreamImpl<Request, Response>(
    handle: ClientStreamingCall<Request, Response>,
): handleClientStreamingCall<Request, Response> {
    return (
        call: ServerReadableStream<Request>,
        callback: sendUnaryData<Response>,
    ): void => {
        // tslint:disable-next-line: no-try
        try {
            const reqOb$ = new Subject<Request>()
            handle(reqOb$).pipe(take(1)).subscribe(
                (response: Response | GrpcException): void => {
                    if (!isGrpcException(response)) {
                        callback(null, response)
                        return
                    }
                    const error = getServiceError(response)
                    logError(error)
                    callback(error, null)
                },
                (error: Error): void => {
                    callback(error, null)
                },
            )
            call.on('data', (req: Request): void => {
                reqOb$.next(req)
            })
            call.on('end', (): void => {
                reqOb$.complete()
            })
        // tslint:disable-next-line: unknown-instead-of-any
        } catch (e: any) {
            logError(e)
            callback(e, null)
        }
    }
}

function getBidiStreamImpl<Request, Response>(
    handle: BidiStreamingCall<Request, Response>,
): handleBidiStreamingCall<Request, Response> {
    return (call: ServerDuplexStream<Request, Response>): void => {
        // tslint:disable-next-line: no-try
        try {
            const reqOb$ = new Subject<Request>()
            handle(reqOb$).subscribe(
                (response: Response | GrpcException): void => {
                    if (!isGrpcException(response)) {
                        call.write(response)
                        return
                    }
                    const error = getServiceError(response)
                    logError(error)
                    call.emit('error', error)
                },
                (error: Error): void => {
                    logError(error)
                    call.emit('error', error)
                },
                (): void => {
                    call.end()
                },
            )
            call.on('data', (req: Request): void => {
                reqOb$.next(req)
            })
            call.on('end', (): void => {
                reqOb$.complete()
            })
        // tslint:disable-next-line: unknown-instead-of-any
        } catch (e: any) {
            logError(e)
            call.emit('error', e)
        }
    }
}

function getServiceError(grpcExcp: GrpcException): ServiceError {
    return {
        // tslint:disable-next-line: no-type-assertion
        code: grpcExcp.code as unknown as status,
        message: grpcExcp.message,
        name: 'Grpc Exception',
    }
}

function logError(error: Error): void {
    /**
     * TODO(zecheng): Use log4js to log the infomation.
     */
    // tslint:disable-next-line: no-console
    console.error(error)
}
