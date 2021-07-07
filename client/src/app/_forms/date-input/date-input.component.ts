import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() maxDate: Date;// ==> over 18 to use the web
  //every single property inside this bsDate type is going to be optional we dont have prvide
  //all of the differetn configuration options
  //if we dint use partial then we would have to provide every single possible 
  //configuration option
  bsConfig: Partial<BsDatepickerConfig>
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor= this;
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD MMMM YYYY'
    }
   }
  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {
  
  }
  registerOnTouched(fn: any): void {
 
  }





}
