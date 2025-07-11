import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

import { transitDataApiInterceptor } from './transit-data-api-interceptor';

describe('transitDataApiInterceptorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => transitDataApiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Content-Type header as application/json', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Content-Type')).toBe('application/json');
      done();
      return of({} as HttpEvent<unknown>);
    };
    interceptor(req, next).subscribe();
  });

  it('should forward the request to next handler', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    let called = false;
    const next: HttpHandlerFn = () => {
      called = true;
      done();
      return of({} as HttpEvent<unknown>);
    };
    interceptor(req, next).subscribe(() => {
      expect(called).toBeTrue();
    });
  });

  it('should not modify other headers', (done) => {
    const req = new HttpRequest('GET', '/api/test', { headers: { 'X-Test': 'value' } });
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('X-Test')).toBe('value');
      done();
      return of({} as HttpEvent<unknown>);
    };
    interceptor(req, next).subscribe();
  });
});
