import {
    PlaceholderIDsRequestBuilder,
} from '@logi-pb/src/proto/inner/report_pb'
import {readFileSync} from 'fs'
import {getPlaceholderIDs} from './placeholder'

describe('placeholder test', (): void => {
    it('test encode into placeholder', (): void => {
        const testBase64 = 'CjblvZLlsZ7kuo7mr43lhazlj7jmiYDmnInogIXnmoTpnZ7nu4/luLjmgKfmjZ/nm4rlh4Dpop0SNuW9kuWxnuS6juavjeWFrOWPuOaJgOacieiAheeahOmdnue7j+W4uOaAp+aNn+ebiuWHgOminRoD5YWDIAEoAzIKMjAyMS0wMy0zMTgEQAFRAAAAAAAA8D8='
        const modelPath = `${__dirname}/placeholder.docx`
        const buf = readFileSync(modelPath)
        const req = new PlaceholderIDsRequestBuilder().binary(buf).build()
        const resp = getPlaceholderIDs(req)
        expect(resp.ids.length).toBe(1)
        expect(resp.ids[0]).toBe(testBase64)
    })
})