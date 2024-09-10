import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {ImageService} from "../../services/image-service/image.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('imageAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateY(100px)' }), { optional: true }),
        query(':enter', stagger('500ms', [
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]), { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy{

  @ViewChild('contentSection') contentSection!: ElementRef;

  images: string[] = [];
  imageTexts: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  imagesLoaded = false;

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit() {
    this.loadImages();
  }

  ngOnDestroy() {
    this.imagesLoaded = false;
    this.images = [];
  }

  loadImages() {
    this.images = this.imageService.getImages();
    this.imagesLoaded = true;
  }

  navigateToMyDiary() {
    this.router.navigate(['diary']);
  }

  scrollToContent() {
    if (this.contentSection) {
      this.contentSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
