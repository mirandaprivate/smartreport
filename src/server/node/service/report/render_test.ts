import {
    RenderTemplateRequestBuilder,
} from '@logi-pb/src/proto/inner/report_pb'
import {
    DataValueBuilder,
    DataValue,
    Value,
    ValueBuilder,
    _Value_Value_Type,
    _Value_Value,
} from '@logi-pb/src/proto/jianda/data_pb'
import {readFileSync} from 'fs'
import {renderTemplate} from './render'
const mammoth = require('mammoth')

describe('placeholder test', (): void => {
    it('test encode into placeholder', async(): Promise<void> => {
        const testData: Map<string, Value> = new Map([
            ['1', new ValueBuilder().value(500, _Value_Value.I32).build()],
            ['2', new ValueBuilder().value('1\n2\n3', _Value_Value.S).build()],
            ['3', new ValueBuilder().build()],
        ])
        const values: DataValue[] = Array.from(testData.keys()).map(key => {
            const v = testData.get(key) as Value
            return new DataValueBuilder().placeholderId(key).value(v).build()
        })

        const modelPath = `${__dirname}/render.docx`
        const renderDoc = readFileSync(modelPath)
        const req = new RenderTemplateRequestBuilder()
            .template(renderDoc)
            .data(values)
            .build()
        const resp = renderTemplate(req)
        const expectDoc = readFileSync(`${__dirname}/render_expect.docx`)
        const text = await mammoth.extractRawText({buffer: resp.doc})
        const expectText = await mammoth.extractRawText({buffer: expectDoc})
        expect(text.value).toBe(expectText.value)
    })
})
