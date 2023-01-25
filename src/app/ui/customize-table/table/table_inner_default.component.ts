/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core'

import {LogiSafeAny, LogiTableLayout} from '../table.type'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'logi-table-inner-default',
    templateUrl: './table_inner_default.template.html',
})
export class LogiTableInnerDefaultComponent {
    public constructor(
         private readonly _elementRef: ElementRef,
         ) {
        // TODO: move to host after View Engine deprecation
        this._elementRef.nativeElement.classList.add('logi-table-container')
    }
    @Input() public tableLayout: LogiTableLayout = 'auto'
    @Input() public listOfColWidth: readonly (string | null)[] = []
    @Input() public theadTemplate: TemplateRef<LogiSafeAny> | null = null
    @Input() public contentTemplate: TemplateRef<LogiSafeAny> | null = null
}
