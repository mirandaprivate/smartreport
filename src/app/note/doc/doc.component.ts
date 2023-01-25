import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core'
import {BaseWps, DocConfig} from '@logi/src/app/common/wps/params'
import {IWpsCommandBars} from 'wps'

import {DocActionService} from './doc_action.service'

const COMMAND_BARS: readonly IWpsCommandBars[] = [
    {
        attributes: {
            enable: false,
            visible: false,
        },
        cmbId: 'FloatQuickHelp',
    },
    {
        attributes: {
            enable: false,
            visible: false,
        },
        cmbId: 'HeaderLeft',
    },
]

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-wps-docs',
    styleUrls: ['./doc.style.scss'],
    templateUrl: './doc.template.html',
})
export class WpsDocsComponent extends BaseWps
    implements AfterViewInit, OnDestroy {
    public constructor(
        public readonly injector: Injector,
        private readonly _docActionSvc: DocActionService,
    ) {
        super(injector, COMMAND_BARS)
    }

    @Input() public data!: DocConfig
    @Input() public fileName!: string
    @Output() public readonly success$ = new EventEmitter<boolean>()
    @ViewChild('word') public element!: ElementRef<HTMLDivElement>

    public ngAfterViewInit(): void {
        this.init()
    }

    public async ngOnDestroy(): Promise<void> {
        await this.wps.destroy()
        this.unsubscribe()
    }

    public async initView(): Promise<void> {
        /**
         * Init wps doc app here for service.
         */
        this._docActionSvc.init(
            this.app,
            this.data._w_file_id,
            this.data.getWpsType()
        )
    }
}
