import {ClientRpcDescriptorBuilder} from './client'

describe('test client', (): void => {
    it('test client rpc descriptor', (): void => {
        // tslint:disable: ban-types
        const desc = new ClientRpcDescriptorBuilder<String, String>()
            .path('Foo/Bar')
            .request('Foo')
            .responseType(String)
            .encodeRequest((
                req: String,
            ): Uint8Array => new TextEncoder().encode(req.toString()),
            )
            .decodeResponse((bytes: Uint8Array): String => {
                return new TextDecoder().decode(bytes)
            })
            .build()
        expect(desc.path).toBe('Foo/Bar')
        expect(desc.responseType).toBe(String)
        expect(desc.request).toBe('Foo')
        expect(desc.encodeRequest(desc.request))
            // tslint:disable: no-magic-numbers
            .toEqual(new Uint8Array([70, 111, 111]))
        expect(desc.decodeResponse(new Uint8Array([70, 111, 111]))).toBe('Foo')
    })
})
