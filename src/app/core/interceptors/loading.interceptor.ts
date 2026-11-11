import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const excludedUrls = ['/unread-count', '/search', '/notifications', '/follow', 's/uggestions', '/like', '/comments', '/replies'];
  const shouldSkip = excludedUrls.some((url) => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  spinner.show('sample');

  return next(req).pipe(
    finalize(() => {
      spinner.hide('sample');
    }),
  );
};
