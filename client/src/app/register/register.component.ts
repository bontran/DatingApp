import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
// @Input() usersFromHomeComponent: any;
//output property
@Output() cancelRegister = new EventEmitter();
  model: any = {};
  httpService: any;
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const food = ['bon', 'phong', ' john'];
    const food$ = from(food);
    food$.pipe(map((data) => data)).subscribe(console.log);
    of(1, 2, 3, 4, 5).pipe(map((res)=> res)).subscribe(console.log);
  }

 

  register(){
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
      this.toastr.error(error);
    });
  }
  //what we want to emit when the button is clicked
  cancel(){
    this.cancelRegister.emit(false);
  }
}
