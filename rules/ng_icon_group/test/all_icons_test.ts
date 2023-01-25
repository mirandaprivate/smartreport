// tslint:disable: no-magic-numbers
import {
    Group,
    ICONS,
    NgIcon,
} from '@logi-icon/rules/internal/web/ng_icon_group/test/all_icons'

type Data = readonly [string, string, string, readonly Group[]]

describe('icon test', (): void => {
    it('group test', (): void => {
        expect(Group.ALL).toBe(0)
        expect(Group.FOO).toBe(1)
        expect(Group.BAR).toBe(2)
    })
    it('icons test', (): void => {
        expect(ICONS.length).toBe(6)
        const data: readonly Data[] = [
            ['foo_a', 'logi_build/rules/internal/web/ng_icon_group/test/foo_a.svg',
                '1f0e73205eb656f108a614a44ce3d3a1e77eb272',
                [Group.ALL, Group.FOO]],
            ['foo_b', 'logi_build/rules/internal/web/ng_icon_group/test/foo_b.svg',
                '5f1e3e654ebb8c8f3ca9a353363c0bb0348834af',
                [Group.ALL, Group.FOO]],
            ['test_bar_a',
                'logi_build/rules/internal/web/ng_icon_group/test/bar_a.svg',
                '29b655f3b0d916e04f711649d2265abc7e52aaaf',
                [Group.ALL, Group.BAR]],
            ['test_bar_b',
                'logi_build/rules/internal/web/ng_icon_group/test/bar_b.svg',
                '904f62bb7840ec1a83b95435f9e463fb00c64cb6',
                [Group.ALL, Group.BAR]],
            ['ng_icon_group_test_a',
                'logi_build/rules/internal/web/ng_icon_group/test/a.svg',
                '3f786850e387550fdab836ed7e6dc881de23001b', [Group.ALL]],
            ['ng_icon_group_test_b',
                'logi_build/rules/internal/web/ng_icon_group/test/b.svg',
                '89e6c98d92887913cadf06b2adb97f26cde4849b', [Group.ALL]],
        ]
        ICONS.forEach((icon: NgIcon, index: number): void => {
            const expectIcon = data[index]
            expect(icon.id).toBe(expectIcon[0])
            expect(icon.uri).toBe(expectIcon[1])
            expect(icon.hash).toBe(expectIcon[2])
            expect(icon.groups).toEqual(expectIcon[3])
        })
    })
})
