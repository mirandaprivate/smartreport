import {ServerRpcDescriptorBuilder} from './server'

describe('test server', (): void => {
    it('test server rpc descriptor', (): void => {
        const desc = new ServerRpcDescriptorBuilder<string, string>()
            .path('Foo/Bar')
            .handle((req: string): string => `Hello ${req}`)
            .decodeRequest((bin: Buffer): string => bin.toString())
            .encodeResponse((res: string): Buffer => Buffer.from(res))
            .clientStream(true)
            .serverStream(false)
            .build()
        expect(desc.path).toBe('Foo/Bar')
        expect(desc.clientStream).toBe(true)
        expect(desc.serverStream).toBe(false)
        // tslint:disable-next-line: no-type-assertion
        const handle = desc.handle as (str: string) => string
        expect(handle('Foo')).toBe('Hello Foo')
        // tslint:disable: no-magic-numbers
        expect(desc.encodeResponse('Foo')).toEqual(Buffer.from([70, 111, 111]))
        expect(desc.decodeRequest(Buffer.from([70, 111, 111]))).toBe('Foo')
    })
})
