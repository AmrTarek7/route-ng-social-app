import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './core/interceptors/headers.interceptor';
import { provideToastr } from 'ngx-toastr';
import { handelErrorInterceptor } from './core/interceptors/handel-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withComponentInputBinding(),
    ),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, handelErrorInterceptor])),
    provideToastr(),
  ],
};
