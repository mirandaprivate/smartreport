import {
    Exception,
    ExceptionBuilder,
    isException,
} from '../../common/exception'

import {Message} from './base'
import {GLOBAL_REGISTRY} from './registry'

/**
 * Decode the any type message in a message.
 * In a message, an any type message needs two fields to store:
 * - public foo: unknown // The message decoded from Any.
 * - private _foo_any: google__protobuf__any.Any // the google Any message
 * The first field can be used by users.The second one is used for
 * encode/decode.
 * After decode the first field is just set the google Any message, this
 * function resets it to the second field, and decode the corresponding meesage
 * according to the typeUrl and binary in the Any message, then set it to the
 * first field.
 */
export function decodeAny(anyAttr: string, msg: Message): void | Exception {
    const googleAny = Reflect.get(msg, anyAttr)
    if (googleAny === undefined)
        return
    let decodedMsg = googleAny instanceof Array
        ? decodeRepeated(googleAny)
        : googleAny
    decodedMsg = googleAny instanceof Map
        ? decodeMap(decodedMsg)
        : decodedMsg
    decodedMsg = googleAny === decodedMsg
        ? decodeSingle(decodedMsg)
        : decodedMsg
    if (isException(decodedMsg))
        return decodedMsg
    Reflect.set(msg, `_${anyAttr}_any`, googleAny)
    Reflect.set(msg, anyAttr, decodedMsg)
}

/**
 * Decode a single google.protobuf.Any field.
 */
function decodeSingle(googleAny: unknown): Message | Exception {
    if (!isGoogleAny(googleAny))
        return new ExceptionBuilder()
            .message('Not an google.protobuf.Any message.')
            .build()
    const typeUrl = googleAny.typeUrl
    const value = googleAny.value
    const fq = `.${typeUrl.substring(typeUrl.lastIndexOf('/') + 1)}`
    const constructor = GLOBAL_REGISTRY.getConstructor(fq)
    if (constructor === undefined)
        return new ExceptionBuilder()
            .message('Can not find constructor for any typeUrl.')
            .build()
    const builder = Reflect.construct(constructor, [])
    return builder.decode(value).build()
}

/**
 * Decode a repeated google.protobuf.Any field.
 */
function decodeRepeated(
    googleAnyArray: readonly unknown[],
): readonly Message[] | Exception {
    const decodeMsgs: Message[] = []
    for (const anyMsg of googleAnyArray) {
        const decodeMsg = decodeSingle(anyMsg)
        if (isException(decodeMsg))
            return decodeMsg
        decodeMsgs.push(decodeMsg)
    }
    return decodeMsgs
}

/**
 * Decode a map field such as map<string, google.protobuf.Any>.
 */
function decodeMap(
    anyMap: Map<string | number, unknown>,
): Map<string | number | Long, Message> | Exception {
    const map = new Map<string | number | Long, Message>()
    for (const item of Array.from(anyMap)) {
        const decodeMsg = decodeSingle(item[1])
        if (isException(decodeMsg))
            return decodeMsg
        map.set(item[0], decodeMsg)
    }
    return map
}

interface GoogleAny {
    readonly typeUrl: string
    readonly value: Readonly<Uint8Array>
}

function isGoogleAny(obj: unknown): obj is GoogleAny {
    if (typeof obj !== 'object' || obj === null)
        return false
    const typeUrl = Reflect.get(obj, 'typeUrl')
    if (typeof typeUrl !== 'string')
        return false
    const value = Reflect.get(obj, 'value')
    if (!(value instanceof Uint8Array))
        return false
    return true
}
