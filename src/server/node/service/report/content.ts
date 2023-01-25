import {
    DocContent,
    DocContentBuilder,
    DocContentRequest,
} from '@logi-pb/src/proto/inner/report_pb'
import {Observable, from} from 'rxjs'
import {map} from 'rxjs/operators'
const mammoth = require('mammoth')

export function getDocContent(req: DocContentRequest): Observable<DocContent> {
    return from(mammoth.extractRawText({buffer: req.binary})).pipe(map((
        res: any,
    ): DocContent => new DocContentBuilder().content(res.value).build()))
}
