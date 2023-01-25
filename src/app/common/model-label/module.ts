import {NgModule} from '@angular/core'

import {BenchmarkLabelComponent} from './benchmark.component'
import {ReleasedLabelComponent} from './released.component'
import {SourceFileComponent} from './source-file.component'

@NgModule({
    declarations: [
        BenchmarkLabelComponent,
        ReleasedLabelComponent,
        SourceFileComponent,
    ],
    exports: [
        BenchmarkLabelComponent,
        ReleasedLabelComponent,
        SourceFileComponent,
    ],
})
export class ModelLabelModule {}
