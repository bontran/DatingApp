import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  httpService: any;
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService,
     private toastr: ToastrService,
      private fb: FormBuilder,
      private router: Router) { }

  ngOnInit(): void {
    this.initializedForm();
    this.maxDate = new Date();
    //not allow any selection of  date lest than 18 years 
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
    // const food = ['bon', 'phong', ' john'];
    // const food$ = from(food);
    // food$.pipe(map((data) => data)).subscribe(console.log);
    // of(1, 2, 3, 4, 5).pipe(map((res)=> res)).subscribe(console.log);
  }
  initializedForm(){
    this.registerForm  = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knowAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)]],
      confirmPassword:[ '',
       [Validators.required,
        this.matchValues('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() =>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string):ValidatorFn{
    //formcontrol dervire from abstractc  ontrol
    return(control : AbstractControl) => {
      if (control.parent && control.parent.controls) {
        return control.value ===
          (control.parent.controls as { [key: string]: AbstractControl })[
            matchTo
          ].value
          ? null
          : { isMatching: true };
      }
    }
  }

  register(){
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
      this.cancel();
    }, error => {
      console.log(error);
      this.validationErrors = error;

    });
  }
  //what we want to emit when the button is clicked
  cancel(){
    this.cancelRegister.emit(false);
  }
}
