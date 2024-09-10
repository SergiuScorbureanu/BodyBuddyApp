import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {ApiService} from "../api-service/api-service";
import {DisplayMeal} from "../../models/display-meal";

@Injectable({
  providedIn: 'root'
})
export class MealService {
  public mealTypeSource = new BehaviorSubject<string>('');
  public mealType$: Observable<string> = this.mealTypeSource.asObservable();
  public dateSource = new BehaviorSubject<string>('');
  public date$: Observable<string> = this.dateSource.asObservable();

  constructor(
    private apiService: ApiService
  ) { }

  setMealTypeSource(mealType: string, dateType: string) {
    this.mealTypeSource.next(mealType);
    this.dateSource.next(dateType);
  }

  getMealsByDate(id: string, date: string): Observable<DisplayMeal[]> {
    return this.apiService.meals.getMealsByDate(id, date);
  }

  countMeals(): Observable<number> {
    return this.apiService.meals.countMeals();
  }

  deleteMeal(id: string): Observable<any> {
    return this.apiService.meals.deleteMeal(id);
  }


}
