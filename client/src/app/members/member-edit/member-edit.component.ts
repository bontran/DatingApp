import { HttpHeaders, HttpClientModule, HttpClient  } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  //this give us access to this editForm template form inside components
  @ViewChild('editForm') editForm: NgForm;
  myImage1: string = "assets/images/1.jpg";
  myImage2: string = "assets/images/2.jpg";
  myImage3: string = "assets/images/3.jpg";
  member: Member;
  user: User;
  //user did not have access to brower events as well from angular via the host listener
  //that we are just looked at here
  // @HostListener(window:beforeunload) : do something before the browser is closed
  //then we  are got an option to do so via this host listener
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
    if(this.editForm.dirty)
      $event.returnValue = true;
  }
  constructor(private accountService: AccountService,
    private toastr: ToastrService,
    private memberService: MembersService,
    private http: HttpClient) {
  //current user is observale and what we need to do is get the user out of that observable and use that for our users
   this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user)    
   }
  ngOnInit(): void {
    this.loadMember();
  }
  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember(){
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("Profile updated successfully");
      //updated the member after we are submitted our form
      this.editForm.reset(this.member);
    })
  
  }
}
