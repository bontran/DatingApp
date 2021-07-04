import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;
    //take one thing from observable
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> currentUser =user );
    if(currentUser){
      //(2)because we are clone this request here when we return from this, its that request
      //request if we are logged in ,that going to receive our authorization header and send that up with 
      //our request
      request = request.clone({
        setHeaders: {
          //attach our token for every request when are logged (1)
          //in and send that up with our request
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }
    return next.handle(request);
  }
}
