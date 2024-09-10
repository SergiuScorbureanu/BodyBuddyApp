import {Component, OnInit} from '@angular/core';
import {MealService} from '../../services/meal-service/meal.service';
import {Meal} from '../../models/meal';
import {StorageService} from '../../services/storage-service/storage.service';
import {Router} from '@angular/router';
import {ApiService} from "../../services/api-service/api-service";
import {MessageService} from "../../services/message-service/message.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {FoodDetailsComponent} from "../food-details-component/food-details.component";

@Component({
  selector: 'app-create-meal',
  templateUrl: './create-meal.component.html',
  styleUrl: './create-meal.component.scss'
})
export class CreateMealComponent implements OnInit {
  public meal: Meal = new Meal();
  private userId: string | null = null;
  modalRef: MdbModalRef<FoodDetailsComponent> | null = null;

  constructor(
    private apiService: ApiService,
    private mealService: MealService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private modalService: MdbModalService
  ) {}

  ngOnInit() {
    this.userId = this.storageService.getLoggedInUserId();
    this.mealService.mealType$.subscribe(mealType => this.meal.mealType = mealType);
    this.mealService.date$.subscribe(date => this.meal.date = date);
    console.log(this.meal)
  }

  logMeal() {
    if (this.meal.foods && this.meal.foods.length > 0) {
      if (this.userId) {
        this.meal.userId = this.userId;
        this.meal.foods.forEach(mealFood => this.meal.fat += mealFood.food.fat);
        this.meal.foods.forEach(mealFood => this.meal.calories += mealFood.food.calories);
        this.meal.foods.forEach(mealFood => this.meal.carbohydrates += mealFood.food.carbohydrates);
        this.meal.foods.forEach(mealFood => this.meal.protein += mealFood.food.protein);
        this.apiService.meals.createMeal(this.meal).subscribe({
          next: (meal) => {
            console.log('Meal logged:', meal);
            this.messageService.showSuccess('Meal logged');
            this.router.navigate(['/diary']);
          },
          error: (e) => {
            console.error('Error logging meal:', e);
            this.messageService.showError('An error occurred while logging the meal');
          },
        });
      } else {
        console.error('No user ID available');
        this.messageService.showError('No user ID found. Please log in');
      }
    } else {
      console.error('No foods added to the meal');
      this.messageService.showError('No foods added to the meal');
    }
  }

  onQuantityChange() {
    this.isMealFoodsQuantityCompleted();
  }

  isMealFoodsQuantityCompleted(): boolean {
    // console.log('isMealFoodsQuantityCompleted:', evaluation);
    return this.meal.foods.length > 0 && this.meal.foods.every(mealFood => mealFood.quantity > 0);
  }

  showFoodDetails(food: any) {
    this.modalRef = this.modalService.open(FoodDetailsComponent, {
      data: {
        title: food.name,
        food: food
      }
    })
    if (this.modalRef) {
      this.modalRef.onClose.subscribe((message: any) => {
        console.log('Modal closed with message:', message);
      });
    }
  }

  deleteFood(index: number) {
    this.meal.foods.splice(index, 1);
    this.onQuantityChange();
  }
}
