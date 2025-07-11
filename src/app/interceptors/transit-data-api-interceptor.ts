import { HttpInterceptorFn } from '@angular/common/http';

export const transitDataApiInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      // Add auth
    }
  });

  return next(modifiedReq);
};