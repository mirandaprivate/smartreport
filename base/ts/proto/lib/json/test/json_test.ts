import {DurationBuilder} from '@logi-pb/src/ts/proto/lib/json/test/duration_pb'
import {
    OtherBuilder,
    OtherItemEnum,
} from '@logi-pb/src/ts/proto/lib/json/test/other_pb'
import {
    FieldNameBuilder,
    FooBuilder,
    ImportMsgBuilder,
    ImportMsg_ItemEnum,
    ImportMsg_SubBuilder,
    ItemEnum,
    NestedAnyBuilder,
    NestedBuilder,
    WktBuilder,
} from '@logi-pb/src/ts/proto/lib/json/test/test_pb'
import {
    TimestampBuilder,
} from '@logi-pb/src/ts/proto/lib/json/test/timestamp_pb'
import Long from 'long'

// tslint:disable-next-line: max-func-body-length
describe('ts proto json test', (): void => {
    it('common field types', (): void => {
        const subSub = new FooBuilder().item(ItemEnum.FOO).build()
        const sub = new FooBuilder()
            .number(100)
            .numberArray([100, 101])
            .long(Long.fromString('123'))
            .longArray([Long.fromString('123'), Long.fromString('124')])
            .bytes(new Uint8Array([1, 2, 3]))
            .bytesArray([new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4])])
            .double(123.456)
            .doubleArray([123.456, 345.678])
            .bool(true)
            .boolArray([true, false])
            .str('foo')
            .strArray(['foo', 'bar'])
            .item(ItemEnum.BAR)
            .itemArray([ItemEnum.FOO, ItemEnum.BAR])
            .message(subSub)
            .messageArray([subSub])
            .map(new Map([['foo', subSub]]))
            .build()
        const foo = new FooBuilder()
            .number(100)
            .numberArray([100, 101])
            .long(Long.fromString('123'))
            .longArray([Long.fromString('123'), Long.fromString('124')])
            .bytes(new Uint8Array([1, 2, 3]))
            .bytesArray([new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4])])
            .double(123.456)
            .doubleArray([123.456, 345.678])
            .bool(true)
            .boolArray([true, false])
            .str('foo')
            .strArray(['foo', 'bar'])
            .item(ItemEnum.BAR)
            .itemArray([ItemEnum.FOO, ItemEnum.BAR])
            .message(sub)
            .messageArray([sub, subSub])
            .map(new Map([['foo', sub]]))
            .build()
        expect(new FooBuilder().fromJson(foo.toJson()).build()).toEqual(foo)
    })
    it('nested message', (): void => {
        const nested = new NestedBuilder().item(ItemEnum.BAR).build()
        const root = new NestedBuilder()
            .item(ItemEnum.FOO)
            .nested(nested)
            .build()
        expect(new NestedBuilder().fromJson(root.toJson()).build())
            .toEqual(root)
    })
    it('field name', (): void => {
        const name = new FieldNameBuilder()
            .foo(1)
            .fooBaR(2)
            .foooBar(3)
            .foo1(4)
            .fooooBaR(5)
            ._foooooBaR(6)
            ._fooooooBar(7)
            .foOoooOoBar(8)
            .f1OOoo1BaR(9)
            .build()
        expect(new FieldNameBuilder().fromJson(name.toJson()).build())
            .toEqual(name)
    })
    it('message and enum from other place', (): void => {
        const msg = new ImportMsgBuilder()
            .sub(new ImportMsg_SubBuilder()
                .item(ImportMsg_ItemEnum.BAR)
                .build())
            .otherItem(OtherItemEnum.OTHER_BAR)
            .other(new OtherBuilder().item(OtherItemEnum.OTHER_FOO).build())
            .build()
        expect(new ImportMsgBuilder().fromJson(msg.toJson()).build())
            .toEqual(msg)
    })
    it('well known type', (): void => {
        const foo = new FooBuilder().item(ItemEnum.BAR).build()
        const wkt = new WktBuilder()
            .time(new TimestampBuilder()
                .nanos(21000000)
                .seconds(Long.fromString('456456465'))
                .build())
            .duration(new DurationBuilder()
                .seconds(Long.fromString('-123'))
                .nanos(-456000000)
                .build())
            .any(foo)
            .anyArray([foo])
            .anyMap(new Map([[1, foo]]))
            .nestedAny(new NestedAnyBuilder().any(foo).build())
            .build()
        expect(new WktBuilder().fromJson(wkt.toJson()).build()).toEqual(wkt)
    })
})
