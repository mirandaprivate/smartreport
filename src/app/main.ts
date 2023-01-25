// import {enableProdMode} from '@angular/core';
// import {platformBrowser} from '@angular/platform-browser';
// import {AppModule} from './app/module';

// enableProdMode();
// platformBrowser().bootstrapModule(AppModule);

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from './app/app.module'

// tslint:disable-next-line: top-level-call
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err))
