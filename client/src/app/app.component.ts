import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  //private http: HttpClient,
  constructor ( private accountService: AccountService){}
  users: any;
  ngOnInit() {

    this.setCurrentUser();
  }

  setCurrentUser(){
    /*fortunee is correct, however since everything in localStorage is stored as strings,
    Typescript has no way of guaranteeing that the object is still the same object.
    In this case, you need to tell Typescript what type the parsed object will be with
    a cast.*/
    //get a user from localstore and pass it to accountservice
    const user: User = JSON.parse(localStorage.getItem('user')) as User;
    this.accountService.setCurrentUser(user);
  }

  // getUsers(){
  //   this.http.get('https://localhost:5001/api/users').subscribe(response => {
  //     this.users = response;
  //   }, error => {
  //     console.log(error);
  //   })
  // }
}
