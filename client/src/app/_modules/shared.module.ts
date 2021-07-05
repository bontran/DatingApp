import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(), 
    NgxGalleryModule,

  ],
  exports:[
   BsDropdownModule,
   CommonModule,
    TabsModule, 
     NgxGalleryModule,
  ]
})
export class SharedModule { }
