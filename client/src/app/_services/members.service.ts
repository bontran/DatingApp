import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams:UserParams;
  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(){
    return this.userParams;
  }
  setUserParams(params:UserParams){
    this.userParams = params;
  }
  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  getMembers(UserParams: UserParams){
   
    var response = this.memberCache.get(Object.values(UserParams).join('-'));
     //if we have response in our cache return it
    if(response){
      return of(response);
    }
    //console.log(Object.values(UserParams).join('-'));
    let params = this.getPaginationHeaders(UserParams.pageNumber, UserParams.pageSize);
    params = params.append('minAge', UserParams.minAge.toString());
    params = params.append('maxAge', UserParams.maxAge.toString());
    params = params.append('gender', UserParams.gender);
    params = params.append('orderBy', UserParams.orderBy);
    //go to our API we go and get our members if we dont have them in our cache
    //but if we do have them in our cash, in the query is identical then we just retrieve this from our cache
    return this.getPaginationResult<Member[]>(this.baseUrl+'users', params)
    .pipe(map(response => {
      this.memberCache.set(Object.values(UserParams).join('-'), response);
      return response;
    }))
  }
 
  getMember(username: string){
    //get all value in cache
    const member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.result),[])
    .find((member: Member) => member.username === username);
    if(member){
      return of(member);
    }
    console.log(member);
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

   private getPaginationResult<T>(url: any, params: any) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();
        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());
        return params;
  }
}
