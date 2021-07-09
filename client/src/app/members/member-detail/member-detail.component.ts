import { Component, OnInit,ChangeDetectorRef, EventEmitter, OnChanges, SimpleChanges, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
//import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static: true}) memberTabs: TabsetComponent; //get memberTabs
  member: Member;
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  activeTab: TabDirective
  messages: Message[] = [];
  constructor(private memberServices: MembersService, private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
  this.route.data.subscribe(data => {
    this.member = data.member;
  })
  this.route.queryParams.subscribe(params => {
    params.tab ? this.selecTab(params.tab) : this.selecTab(0);
  })
  // this.galleryOptions = [
  //   {
  //       width: '500px',
  //       height: '500px',
  //       thumbnailsColumns: 4,
  //       imagePercent: 100,
  //       preview: false,
  //       imageAnimation: NgxGalleryAnimation.Slide
  //   }]
  
  }

// getImages(): NgxGalleryImage[]{
//   const imageUrls = [];
//   for(const photo of this.member.photos) {
//     imageUrls.push({
//       small: photo?.url,
//       medidum: photo?.url,
//       big: photo?.url
//     })
//   }
//   return imageUrls
// }

  loadMessages(){
    this.messageService.getMesageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }
  onTabActivated(data: TabDirective){
    //have access to the infomation inside tab
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.loadMessages();
    }
  }
  selecTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
}
