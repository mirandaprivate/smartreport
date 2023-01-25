import {
    Output,
    EventEmitter,
    Component,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core'
import {DataListResponse_Source} from '@logi-pb/src/proto/jianda/data_pb'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-source-names',
    styleUrls: ['./source-names.component.scss'],
    templateUrl: './source-names.component.html',
})
export class SourceNamesComponent {
    @Input() sources!: readonly DataListResponse_Source[]
    @Input() currSource?: DataListResponse_Source
    @Input() researchName = ''
    @Output() readonly sourceChanged$ = new EventEmitter<string>()
    get sourceName(): string {
        return this.currSource?.name ?? ''
    }
}
