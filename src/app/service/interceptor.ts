import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  
  loadingRedirection = false;
  
  constructor(
    private spinner: SpinnerService,
    private router: Router,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.get("skip"))
      return next.handle(req);

    const token = localStorage.getItem('token');
    
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    this.spinner.setSpinner(true, req.url);
    return next.handle(req).pipe(
      finalize(() => this.spinner.setSpinner(false, req.url)),
      tap(
        (event) => {
          if (event instanceof HttpErrorResponse) {
            this.spinner.setSpinner(false, req.url)
            this.handleErrorStatus(event.status);
          }
        },
        (err) => {
          this.handleErrorStatus(err.status);
          this.spinner.setSpinner(false, req.url)
          return throwError(err);
        }
      )
    )
  }

  private handleErrorStatus(status: number) {
    if (status === 403 || status === 401 || status === 302) {
      this.router.navigate(["/"]);
    }
  }

}
