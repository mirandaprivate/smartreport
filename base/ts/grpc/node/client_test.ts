import {ClientRpcDescriptorBuilder} from './client'

describe('test client', (): void => {
    it('test client rpc descriptor', (): void => {
        const desc = new ClientRpcDescriptorBuilder<string, string>()
            .path('Foo/Bar')
            .reqMsg('Foo')
            .encodeRequest((data: string): Buffer => Buffer.from(data))
            // tslint:disable: no-magic-numbers
            .decodeResponse((data: Buffer): string => {
                return data.toString()
            })
            .clientStream(true)
            .serverStream(false)
            .build()
        expect(desc.path).toBe('Foo/Bar')
        expect(desc.clientStream).toBe(true)
        expect(desc.serverStream).toBe(false)
        expect(desc.reqMsg).toEqual('Foo')
        expect(desc.decodeResponse(desc.encodeRequest('Foo'))).toBe('Foo')
    })
})
