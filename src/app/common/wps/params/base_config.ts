// tslint:disable: variable-name naming-convention
import {Builder} from '@logi/base/ts/common/builder'
import {Impl} from '@logi/base/ts/common/mapped_types'
import {FileTypeEnum} from '@logi-pb/src/proto/wps/wps_pb'
import {WpsFileType} from './file_type'

export interface WpsConfig {
    readonly _w_tokentype: number
    readonly _w_file_id: string
    readonly _w_file_type: FileTypeEnum
    readonly jid: string
    readonly versionId?: number
    getWpsType(): WpsFileType
}

export class WpsConfigImpl {
    public _w_tokentype = 1
    public _w_file_id!: string
    public _w_file_type!: FileTypeEnum
    public versionId?: number
    public jid = ''
}
export class WpsConfigBuilder<T extends WpsConfigImpl, S extends Impl<T>>
    extends Builder<T, S> {
    public fileId(value: string): this {
        this.getImpl()._w_file_id = value
        return this
    }

    public fileType(value: FileTypeEnum): this {
        this.getImpl()._w_file_type = value
        return this
    }

    public versionId(versionId: number): this {
        this.getImpl().versionId = versionId
        return this
    }

    public jid(jid: string): this {
        this.getImpl().jid = jid
        return this
    }

    protected get daa(): readonly string[] {
        return WpsConfigBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        '_w_file_id',
        '_w_file_type',
    ]
}

export function isWpsConfig(value: unknown): value is WpsConfig {
    return value instanceof WpsConfigImpl
}

export function assertIsWpsConfig(value: unknown): asserts value is WpsConfig {
    if (!(value instanceof WpsConfigImpl))
        throw Error('Not a WpsConfig!')
}
