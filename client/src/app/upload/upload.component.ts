import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public message : string;
  public progress: number;
  member: Member;
  
  @Output() public onUpLoadFinished = new EventEmitter();
  constructor(private http: HttpClient, private memberService: MembersService, private accountSerive: AccountService) { }
  private baseUrl = environment.apiUrl;
  ngOnInit(): void {
    this.uploadFile;
  }
  currentUser: any = this.accountSerive.currentUser$.subscribe(user => this.currentUser = user.username);
  public uploadFile = (files:any) => {
    if(files.length === 0){
      return;
    }
    let fileToUpLoad = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpLoad, fileToUpLoad.name);
    console.log(this.currentUser);
    this.http.post(this.baseUrl+this.currentUser + '/upload', formData, {reportProgress: true, observe:'events'})
    .subscribe(event => {
      if(event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total)
      }
      else if(event.type === HttpEventType.Response){
        this.message = ' Upload success';
        this.onUpLoadFinished.emit(event.url);
      }
    })
  }

}
