import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../../models/food';
import {ApiService} from "../api-service/api-service";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private apiService: ApiService) {}

  getFoods(): Observable<Food[]> {
    return this.apiService.foods.getFoods();
  }

  createFood(food: Food): Observable<Food> {
    return this.apiService.foods.createFood(food);
  }

  updateFood(id: string, food: Food): Observable<Food> {
    return this.apiService.foods.updateFood(id, food);
  }

  deleteFood(id: string): Observable<any> {
    return this.apiService.foods.deleteFood(id);
  }

}
