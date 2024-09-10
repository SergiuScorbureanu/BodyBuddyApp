import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {StorageService} from "../../services/storage-service/storage.service";
import {DisplayMeal} from "../../models/display-meal";
import {MessageService} from "../../services/message-service/message.service";
import {DisplayFood} from "../../models/display-food";
import {MealService} from "../../services/meal-service/meal.service";
@Component({
  selector: 'app-view-meals',
  templateUrl: './view-meals.component.html',
  styleUrl: './view-meals.component.scss'
})
export class ViewMealsComponent implements OnInit {

  private _selectedDate = new BehaviorSubject<string>('');
  @Input()
  set selectedDate(value: string) {
    this._selectedDate.next(value);
  }
  get selectedDate(): string {
    return this._selectedDate.getValue();
  }

  @Output() mealDeleted = new EventEmitter<void>();

  userId: string | null = null;
  meals$: Observable<DisplayMeal[]> = new Observable();

  constructor(
    private storageService: StorageService,
    private mealService: MealService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userId = this.storageService.getLoggedInUserId();
    if (this.userId) {
      this.meals$ = this._selectedDate.pipe(
        switchMap(date => this.loadMeals(date))
      );
    } else {
      console.error('User ID is null, cannot load meals');
      this.messageService.showError('User ID is null, cannot load meals');
    }
  }

  loadMeals(date: string): Observable<DisplayMeal[]> {
    if (this.userId && date) {
      return this.mealService.getMealsByDate(this.userId, date);
    } else {
      console.error('User ID is null, cannot load meals');
      this.messageService.showError('User ID is null, cannot load meals');
      return new Observable<DisplayMeal[]>();
    }
  }

  calculateCalories(mealFood: DisplayFood): { calories: number; proteins: number; carbohydrates: number; fats: number } {

    let factor = 1;

    switch (mealFood.measurementUnit) {
      case 'grams':
        factor = mealFood.mealQuantity / mealFood.quantity;
        break;
      case 'ml':
        factor = mealFood.mealQuantity / mealFood.quantity;
        break;
      case 'piece':
        factor = mealFood.mealQuantity * mealFood.quantity;
        break;
      default:
        console.error('Unknown measurement unit');
    }

    return {
      calories: mealFood.calories * factor,
      proteins: mealFood.protein * factor,
      carbohydrates: mealFood.carbohydrates * factor,
      fats: mealFood.fats * factor,
    };
  }

  deleteMeal(meal: DisplayMeal): void {
    if (this.userId) {
      this.mealService.deleteMeal(meal.id!).subscribe({
        next: () => {
          this.messageService.showSuccess("Meal deleted successfully!");
          this._selectedDate.next(this.selectedDate);
          this.mealDeleted.emit();
        },
        error: (err) => {
          console.error('Error deleting meal', err);
          this.messageService.showError('Error deleting meal');
        }
      });
    } else {
      console.error('User ID is null, cannot delete meal');
      this.messageService.showError('User ID is null, cannot delete meal');
    }
  }

}
