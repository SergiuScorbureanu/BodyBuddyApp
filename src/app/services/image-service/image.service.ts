import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  getImages() {
    return [
      'assets/images/home_img_breakfast.jpg',
      'assets/images/home_img_lunch.jpg',
      'assets/images/home_img_dinner.jpg',
      'assets/images/home_img_snack.jpg',
    ]
  }
}
