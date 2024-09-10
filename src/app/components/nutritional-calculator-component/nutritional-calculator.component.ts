import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage-service/storage.service';

@Component({
  selector: 'app-calories-calculator',
  templateUrl: './nutritional-calculator.component.html',
  styleUrl: './nutritional-calculator.component.scss'
})
export class NutritionalCalculatorComponent implements OnInit{

  userId: string | null = null;
  calories: number = 0;
  protein: number = 0;
  fat: number = 0;
  carbohydrates: number = 0;

  constructor(
    // private nutritionalCalculatorService: NutritionalCalculatorService,
    private storageService: StorageService
    ) { }

  ngOnInit() {
    this.userId = this.storageService.getLoggedInUserId();
    if (this.userId) {
      this.calculateCalories();
    }
  }

  calculateCalories() {
    if (!this.userId) return;

    // this.nutritionalCalculatorService.calculateCalories(this.userId).subscribe(data => {
    //   this.calories = data;
    // });
    //
    // this.nutritionalCalculatorService.calculateProtein(this.userId).subscribe(data => {
    //   this.protein = data;
    // });
    //
    // this.nutritionalCalculatorService.calculateFat(this.userId).subscribe(data => {
    //   this.fat = data;
    // });
    //
    // this.nutritionalCalculatorService.calculateCarbohydrate(this.userId).subscribe(data => {
    //   this.carbohydrates = data;
    // });
  }
}
