import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }
  getMembers(){
    //if we have the members then we can return the memebers form the service  as an observale
    if(this.members.length>0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl+'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );

  }

  getMember(username: string){
    //get member inside members
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }

  updateMember(member: Member){
    //pass member as the objects that we pass to our update member method
    //pipe (doing some thing with data)
    return this.http.put(this.baseUrl+"users", member).pipe(
      map(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }
}
