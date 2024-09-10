import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MealService } from '../../services/meal-service/meal.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage-service/storage.service';
import { formatDate} from 'date-fns';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {BehaviorSubject, forkJoin, map, Observable} from "rxjs";
import {NutritionalValueService} from "../../services/nutritional-value-service/nutritional-value.service";
import {NutritionalValue} from "../../models/nutritional-value";
import {ApiService} from "../../services/api-service/api-service";
import {DisplayFood} from "../../models/display-food";
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    fixedWeekCount: false,
    //contentHeight: 500,
    selectable: true,
    headerToolbar: {
      left: 'dayGridWeek,dayGridMonth',
      center: 'title',
      right:'prev,next'
    },
    events: []
  };

  userId: string | null = null;
  selectedDate: string = formatDate(new Date(), 'yyyy-MM-dd');
  selectedDateSubject = new BehaviorSubject<string>(this.selectedDate);
  totalNutritionalValue$ = new Observable<NutritionalValue>();
  maxNutritionalValues$ = new Observable<NutritionalValue>();

  constructor(
    private apiService: ApiService,
    private mealService: MealService,
    private router: Router,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private nutritionalValueService: NutritionalValueService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = this.storageService.getLoggedInUserId();
    if (this.userId) {
      this.nutritionalValueService.getMaxNutritionalValues(this.userId);
      this.maxNutritionalValues$ = this.apiService.nutritionalValues.getMaxNutritionalValues(this.userId);
      this.loadMealsForDay(this.selectedDate);
      this.selectedDateSubject.next(this.selectedDate);
      this.loadEvents();
    }
  }

  addMeal(mealType: string): void {
    this.mealService.setMealTypeSource(mealType, this.selectedDate);
    this.router.navigate(["create-meal"]);
  }

  getProgressPercent(current: number, max: number): string {
    return max ? `${(current / max) * 100}%` : '0%';
  }

  loadMealsForDay(date: string): void {
    if (this.userId && date) {
      this.totalNutritionalValue$ = this.apiService.meals.getMealsByDate(this.userId, date)
        .pipe(
          map(meals => {
          let totalNutritionalValue = new NutritionalValue();
          if (meals) {
            meals.forEach(meal => {
              meal.foods.forEach(food => {

                totalNutritionalValue.carbs += this.calculateNutrients(food).carbohydrates;
                totalNutritionalValue.proteins += this.calculateNutrients(food).proteins;
                totalNutritionalValue.fats += this.calculateNutrients(food).fats;
                totalNutritionalValue.calories += this.calculateNutrients(food).calories;
              })
            })
            totalNutritionalValue.proteins = Math.round(totalNutritionalValue.proteins)
            totalNutritionalValue.carbs = Math.round(totalNutritionalValue.carbs)
            totalNutritionalValue.fats = Math.round(totalNutritionalValue.fats)
            totalNutritionalValue.calories = Math.round(totalNutritionalValue.calories)

          }
          return totalNutritionalValue;
        }))
    } else {
      console.error('User ID is null, cannot load meals');
      this.messageService.showError('User ID is null, cannot load meals');
    }
  }


  handleDateClick(arg: any) {
    this.selectedDate = formatDate(arg.date, 'yyyy-MM-dd');
    this.selectedDateSubject.next(this.selectedDate);
    this.loadMealsForDay(this.selectedDate);
    this.changeDetectorRef.detectChanges();
  }

  calculateNutrients(displayFood: DisplayFood): { calories: number; proteins: number; carbohydrates: number; fats: number } {
    let factor = 1;

    switch (displayFood.measurementUnit) {
      case 'grams':
        factor = displayFood.mealQuantity / displayFood.quantity;
        break;
      case 'ml':
        factor = displayFood.mealQuantity / displayFood.quantity;
        break;
      case 'piece':
        factor = displayFood.mealQuantity * displayFood.quantity;
        break;
      default:
        console.error('Unknown measurement unit');
    }

    return {
      calories: displayFood.calories * factor,
      proteins: displayFood.protein * factor,
      carbohydrates: displayFood.carbohydrates * factor,
      fats: displayFood.fats * factor,
    };
  }

  loadEvents(): void {
    if (this.userId) {
      let events: EventInput[] = [];
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const observables$: Observable<any>[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        let date = new Date();
        date.setDate(day);
        const formattedDate = formatDate(date, 'yyyy-MM-dd');

        const mealObservable$ = this.mealService.getMealsByDate(this.userId, formattedDate).pipe(
          map(meals => {
            let totalCalories = 0;
            if (meals) {
              meals.forEach(meal => {
                if (meal.foods) {
                  meal.foods.forEach(food => {
                    totalCalories += this.calculateNutrients(food).calories;
                  });
                }
              });
            }
            return { date: formattedDate, totalCalories };
          })
        );
        observables$.push(mealObservable$);
      }

      forkJoin(observables$).subscribe(results => {
        this.maxNutritionalValues$.subscribe(maxValues => {
          results.forEach(result => {
            if (result.totalCalories > 0) {
              let color = 'red';
              if (result.totalCalories >= 1.2 * maxValues.calories) {
                color = 'orange';
              } else if (result.totalCalories >= maxValues.calories) {
                color = 'green';
              } else if (result.totalCalories >= 0.7 * maxValues.calories) {
                color = 'orange';
              }
              events.push({
                title: `${Math.round(result.totalCalories)} kcal`,
                start: result.date,
                color: color
              });
            }
          });
          this.calendarOptions.events = events;
          this.changeDetectorRef.detectChanges();
        });
      });
    }
  }
}
