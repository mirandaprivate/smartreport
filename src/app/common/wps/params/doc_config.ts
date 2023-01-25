import {ReportTypeEnum} from '@logi-pb/src/proto/jianda/report_pb'

import {WpsConfig, WpsConfigBuilder, WpsConfigImpl} from './base_config'
import {WpsFileType} from './file_type'

export interface DocConfig extends WpsConfig {
    readonly type: ReportTypeEnum
}

class DocConfigImpl extends WpsConfigImpl implements DocConfig {
    public type!: ReportTypeEnum
    public getWpsType(): WpsFileType {
        if(this.type === ReportTypeEnum.REPORT_TYPE_PPT)
            return WpsFileType.PPT
        if(this.type === ReportTypeEnum.REPORT_TYPE_DOC)
            return WpsFileType.WORD
        // tslint:disable-next-line: no-throw-unless-asserts
        throw Error('Do not suport this report or template type!')
    }
}

export class DocConfigBuilder extends
    WpsConfigBuilder<DocConfig, DocConfigImpl> {
    public constructor(obj?: Readonly<DocConfig>) {
        const impl = new DocConfigImpl()
        if (obj)
            DocConfigBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    public type(type: ReportTypeEnum): this {
        this.getImpl().type = type
        return this
    }

    protected get daa(): readonly string[] {
        return DocConfigBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        ...WpsConfigBuilder.__DAA_PROPS__,
        'type',
    ]
}

export function isDocConfig(value: unknown): value is DocConfig {
    return value instanceof DocConfigImpl
}

export function assertIsDocConfig(value: unknown): asserts value is DocConfig {
    if (!(value instanceof DocConfigImpl))
        throw Error('Not a DocConfig!')
}
