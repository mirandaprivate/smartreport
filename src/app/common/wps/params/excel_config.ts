import {WpsConfig, WpsConfigBuilder, WpsConfigImpl} from './base_config'
import {WpsFileType} from './file_type'

export interface ExcelConfig extends WpsConfig {
    getWpsType(): WpsFileType
}

class ExcelConfigImpl extends WpsConfigImpl implements ExcelConfig {
    getWpsType(): WpsFileType {
        return WpsFileType.EXCEL
    }
}

export class ExcelConfigBuilder extends
WpsConfigBuilder<ExcelConfig, ExcelConfigImpl> {
    public constructor(obj?: Readonly<ExcelConfig>) {
        const impl = new ExcelConfigImpl()
        if (obj)
            ExcelConfigBuilder.shallowCopy(impl, obj)
        super(impl)
    }

    protected get daa(): readonly string[] {
        return ExcelConfigBuilder.__DAA_PROPS__
    }
    protected static readonly __DAA_PROPS__: readonly string[] = [
        ...WpsConfigBuilder.__DAA_PROPS__,
    ]
}

export function isExcelConfig(value: unknown): value is ExcelConfig {
    return value instanceof ExcelConfigImpl
}

export function assertIsExcelConfig(
    value: unknown,
): asserts value is ExcelConfig {
    if (!(value instanceof ExcelConfigImpl))
        throw Error('Not a ExcelConfig!')
}
