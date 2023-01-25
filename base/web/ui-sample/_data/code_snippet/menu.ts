import {CodeTab} from './code_tab'

export const MENU_SAMPLE_A: readonly CodeTab[] = [
    {
        code: {
            component: '',
            style: '',
            template: `
button(
    logi-icon-button
    fontIcon='more_vert'
    '[matMenuTriggerFor]'='menu'
)

mat-menu(
    #menu='matMenu'
    '[class]'='"logi-style-menu-panel"'
)
    button(mat-menu-item) 选项１
    button(mat-menu-item) 选项２
            `,
        },
        title: 'test',
    },
]
