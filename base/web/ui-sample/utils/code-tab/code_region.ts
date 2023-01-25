import {Component, Input} from '@angular/core'
import {Code} from '@logi/base/web/ui-sample/_data/code_snippet'

@Component({
    selector: 'logi-code-region',
    styleUrls: ['./code_region.scss'],
    templateUrl: './code_region.html',
})
export class CodeRegionComponent {
    @Input() public code!: Code
}
