import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'  
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: string[];
  user: User;

  constructor(private viewContainerRef: ViewContainerRef,
     private templateRef: TemplateRef<any>,
     private accountSerivce: AccountService) {
       this.accountSerivce.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
       })
      }
  ngOnInit(): void {
    //clear view if no roles
    if(!this.user?.roles || this.user == null){
      console.log("hello - no roles");
      this.viewContainerRef.clear();
      return;
    }
    //if user has a role in list, then we are going to creat this embedded vie and 
    //user nav-item admin as template ref and going to ad the admin link if they are 
    //in that link
    if(this.user?.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      console.log("hello - has roles");
    }
    else{
      this.viewContainerRef.clear();
      console.log("hello - has roles - cler");
    }
  }

}
