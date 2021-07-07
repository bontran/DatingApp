import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
// import { NgxGalleryModule } from 'ngx-gallery';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(), 
    BsDatepickerModule.forRoot()
 

  ],
  exports:[
   BsDropdownModule,
   CommonModule,
    TabsModule, 
    BsDatepickerModule
  ]
})
export class SharedModule { }
