import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any; //pass user from homecomponent to child register components
  //private http: HttpClient
  constructor() { }

  ngOnInit(): void {
    
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  // getUser(){
  //   //reponse from API(body is an array users => setting this.users in our class to get back from the response)
  //   this.http.get('https://localhost:5001/api/users').subscribe(users => this.users = users)
  // }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }
}
