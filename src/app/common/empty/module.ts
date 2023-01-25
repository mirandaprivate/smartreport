import {NgModule} from '@angular/core'

import {EmptyComponent} from './component'

@NgModule({
    declarations: [EmptyComponent],
    exports: [EmptyComponent],
})
// tslint:disable-next-line: no-unnecessary-class
export class EmptyModule {}
