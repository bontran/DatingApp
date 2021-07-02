import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AppService {
  //fetch data using http
  constructor(private http: HttpClient) { }

  getAllPosts(){
    return this.http.get('https://tutorialzine.com/misc/files/example.json');
  }
}
