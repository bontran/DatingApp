import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(
    //give access to member edit form because we are going to check the status
    //of the form inside here
   
    component: MemberEditComponent): boolean {
      if(component.editForm.dirty){
        return confirm('Are you sure you want to continue? Any unsaved chagnes will be lost.')
      }
    return true;
  }
  
}
