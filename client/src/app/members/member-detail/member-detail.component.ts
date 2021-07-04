import { Component, OnInit,ChangeDetectorRef, EventEmitter, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private memberServices: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  this.loadMember();

  this.galleryOptions = [
    {
        width: '500px',
        height: '500px',
        thumbnailsColumns: 4,
        imagePercent: 100,
        preview: false,
        imageAnimation: NgxGalleryAnimation.Slide
    }]
  
  }

getImages(): NgxGalleryImage[]{
  const imageUrls = [];
  for(const photo of this.member.photos) {
    imageUrls.push({
      small: photo?.url,
      medidum: photo?.url,
      big: photo?.url
    })
  }
  return imageUrls
}

  loadMember(){
    this.memberServices.getMember(this.route.snapshot.paramMap.get('username'))
    .subscribe(member =>{
      this.member = member;
        //init gallery
    this.galleryImages = this.getImages();
    })
  }
}
