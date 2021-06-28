//this service can be injected into other components
//or other services in our application
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
//in angular, service is singleton, 
/**
 when we inject it into a component and its initialized,
 it will stay initialized until our app is disposed of 
 the user closes the brower, for intance, or they move away
 from out application. At that point, our service is destroyed
 , but if they stay in our application, then this account service
 will stay initiated trough the lifetime that the application
 is around
 */
@Injectable({
  //metadata called providedin root
  providedIn: 'root'
})
export class AccountService {
  //used to make a request to API
  baseUrl = 'https://localhost:5001/api/';
  //ReplaySubject like a buffer object is going to store the values inside here
  //any time a subcriber subcribes to less observable, its going to omit the last value inside this   
  private currentUserSource = new ReplaySubject<User>(1);//how many version   of cur user are we going to store?
  currentUser$ = this.currentUserSource.asObservable();
  //inject the HTTp client into our account service
  constructor( private http: HttpClient) {}
  //the login is going to receive our credentials from the login form 
  //form our navbar
  login(model: any){
    //model contain our username and password that we send up to the server
    //
    return this.http.post<User>(this.baseUrl + 'account/login', model)
    .pipe(
      map((response: User) =>{
        const user = response ;
        if(user){
          //populate our user inside local store in the browser
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map((user: User) =>{
        if(user){
          localStorage.setItem('user', JSON.stringify('user'));
          this.currentUserSource.next(user)
        }
        return user;
      })
    )
  }
  
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
     localStorage.removeItem('user');
     this.currentUserSource.next(null);
  }
}
function user(user: any, arg1: (User: any) => void): import("rxjs").OperatorFunction<Object, unknown> {
  throw new Error('Function not implemented.');
}

