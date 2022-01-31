import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  //intercept the http "request" and is the outgoing request
  //next is http response coming back
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError(error =>{
        if(error){
          if(error.status === 404){
            this.router.navigateByUrl('/not-found')
          }

          if(error.status === 500){
            //error.error is the error object we return api
            const navigationExtras: NavigationExtras = {state: {error: error.error}}
            this.router.navigateByUrl('/server-error', navigationExtras)
          }

          //to handle 400 and 404 validation error we make use of error.error(from api) object
          if(error.status === 400){
            //404 validation error
            if(error.error.errors){
              throw error.error
            } else{
              this.toastr.error(error.error.message, error.error.statusCode)
            }
          }

          if(error.status === 401){
            this.toastr.error(error.error.message, error.error.statusCode)
          }
        }
        return throwError(error)
      })
    )
  }
}
