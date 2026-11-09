import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter} from '@angular/router';
import {IonicRouteStrategy} from '@ionic/angular/lazy';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {provideHttpClient, withXhr} from "@angular/common/http";
import {provideIonicAngular} from "@ionic/angular";
import {StorageService} from "services";
import {IonicStorageModule} from "@ionic/storage-angular";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideAppInitializer(() => {
      return inject(StorageService).init();
    })
  ],
});
