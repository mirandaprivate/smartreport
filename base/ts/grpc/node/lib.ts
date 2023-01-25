import {Builder} from '../../common/builder'
import {Impl} from '../../common/mapped_types'
/**
 * See at [https://github.com/grpc/grpc/blob/master/doc/statuscodes.md].
 */
export const enum GrpcStatus {
    OK = 0,
    CANCELLED = 1,
    UNKNOWN = 2,
    INVALID_ARGUMENT = 3,
    DEADLINE_EXCEEDED = 4,
    NOT_FOUND = 5,
    ALREADY_EXISTS = 6,
    PERMISSION_DENIED = 7,
    RESOURCE_EXHAUSTED = 8,
    FAILED_PRECONDITION = 9,
    ABORTED = 10,
    OUT_OF_RANGE = 11,
    UNIMPLEMENTED = 12,
    INTERNAL = 13,
    UNAVAILABLE = 14,
    DATA_LOSS = 15,
    UNAUTHENTICATED = 16,
}

/**
 * Data buffer contains three parts:
 *  - Compress flag: 0 / 1, 1 byte length.
 *  - Message length: 4 bytes unsigned integer, big endian.
 *  - Message binary: The length is according to message length.
 * See `Length-Prefixed-Message` part at
 * [https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md].
 */
/**
 * Parse data and get message binary part.
 */
export function parseData(data: Buffer): Buffer | undefined {
    const prefixedLen = 5
    if (data.length < prefixedLen)
        return
    /**
     * Ignore compress flag at present.
     */
    // const compFlag = data[0]
    const msgLen = data
        .slice(1, prefixedLen)
        // tslint:disable-next-line: no-magic-numbers
        .reduce((pre: number, cur: number): number => (pre << 8) | cur, 0)
    if (data.length !== prefixedLen + msgLen)
        return
    return data.slice(prefixedLen, prefixedLen + msgLen)
}

/**
 * Append 5 prefix bytes to message binary.
 */
export function genData(msgBin: Buffer): Buffer {
    const dataBufs = [
        new Uint8Array([0]),
        new Uint8Array(new Uint32Array([msgBin.length]).buffer).reverse(),
        new Uint8Array(msgBin),
    ]
    return Buffer.concat(dataBufs)
}

export interface GrpcException {
    readonly code: GrpcStatus
    readonly message: string
}

class GrpcExceptionImpl implements Impl<GrpcException> {
    public code!: GrpcStatus
    public message = ''
}

export class GrpcExceptionBuilder
    extends Builder<GrpcException, GrpcExceptionImpl> {
    public constructor(obj?: Readonly<GrpcException>) {
        const impl = new GrpcExceptionImpl()
        if (obj)
            GrpcExceptionBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public code(code: GrpcStatus): this {
        this.getImpl().code = code
        return this
    }

    public message(message: string): this {
        this.getImpl().message = message
        return this
    }

    protected get daa(): readonly string[] {
        return GrpcExceptionBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = ['code']
}

export function isGrpcException(value: unknown): value is GrpcException {
    return value instanceof GrpcExceptionImpl
}

export function assertIsGrpcException(
    value: unknown,
): asserts value is GrpcException {
    if (!(value instanceof GrpcExceptionImpl))
        throw Error('Not a GrpcException!')
}
