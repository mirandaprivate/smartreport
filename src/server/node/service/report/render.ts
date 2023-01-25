import {
    RenderTemplateRequest,
    RenderTemplateResponse,
    RenderTemplateResponseBuilder,
} from '@logi-pb/src/proto/inner/report_pb'
import Docx from 'docxtemplater'
import PizZip from 'pizzip'
const Docxtemplater = require('docxtemplater') as typeof Docx

export function renderTemplate(
    req: RenderTemplateRequest
): RenderTemplateResponse{
    const zip = new PizZip(req.template as Uint8Array)
    const doc = new Docxtemplater(zip, {paragraphLoop: true, delimiters: {start: '{{', end: '}}'}})
    const obj = {}
    req.data.forEach(value => {
        const v = value.value?.getValue()
        const data = v === undefined ? '' : v[0]
        if (data.toString().includes('\n')) {
            const texts = data.toString().split('\n').map(t => {
                return {
                    'text': t,
                }
            })
            Reflect.set(obj, value.placeholderId, texts)
        } else
            Reflect.set(obj, value.placeholderId, data)
    })
    doc.setData(obj)
    doc.render()
    const buf = doc.getZip().generate({type: 'nodebuffer'})
    return new RenderTemplateResponseBuilder().doc(buf).build()
}
