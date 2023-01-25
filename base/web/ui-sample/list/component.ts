// tslint:disable: no-magic-numbers
import {ChangeDetectionStrategy, Component} from '@angular/core'

import {ItemDataSource} from './virtual_scroll'

const LIST_DATA: readonly string[] = [
    'no null keyword',
    'no magic numbers',
    'parameter properties',
    'no forward ref',
    'not host metadata property',
    'no inputs metadata property',
    'variable name',
    'naming convention',
]

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-list-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ListSampleComponent {
    public list1 = LIST_DATA
    public listDataSource = new ItemDataSource()
}
