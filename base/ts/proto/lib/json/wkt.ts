/**
 * See all wkt at
 * (https://developers.google.com/protocol-buffers/docs/proto3#json).
 * TODO(zecheng): Check wkt Struct, Wrapper types, FieldMask, ListValue, Value,
 * NullValue and Empty.
 */

export const enum Wkt {
    ANY = '.google.protobuf.Any',
    DURATION = '.google.protobuf.Duration',
    TIMESTAMP = '.google.protobuf.Timestamp',
}

export function isWkt(typeName: string): boolean {
    switch (typeName) {
    case Wkt.ANY:
    case Wkt.DURATION:
    case Wkt.TIMESTAMP:
        return true
    default:
        return false
    }
}
