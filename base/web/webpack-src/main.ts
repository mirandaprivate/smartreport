import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from '../ui-sample/app/module'

// tslint:disable-next-line: top-level-call
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err))
