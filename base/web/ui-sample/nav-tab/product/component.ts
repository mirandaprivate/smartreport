import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'logi-product-sample',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
})
export class ProductSampleComponent {}
