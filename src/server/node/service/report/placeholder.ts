import {
    PlaceholderIDsRequest,
    PlaceholderIDsResponse,
    PlaceholderIDsResponseBuilder,
} from '@logi-pb/src/proto/inner/report_pb'
import Docx from 'docxtemplater'
import PizZip from 'pizzip'
const Docxtemplater = require('docxtemplater') as typeof Docx
const InspectModule = require('docxtemplater/js/inspect-module')

export function getPlaceholderIDs(
    req: PlaceholderIDsRequest
): PlaceholderIDsResponse {
    const zip = new PizZip(req.binary as Uint8Array)
    const iModule = InspectModule()
    const doc = new Docxtemplater(zip, {modules: [iModule], paragraphLoop: true, delimiters: {start: '{{', end: '}}'}})
    doc.render()
    const tags = iModule.getAllTags()
    const codes: string[] = []
    for (const key in tags)
        codes.push(key)
    return new PlaceholderIDsResponseBuilder().ids(codes).build()
}
