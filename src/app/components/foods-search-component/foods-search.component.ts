import {Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FoodService } from '../../services/food-service/food.service';
import { Food } from '../../models/food';
import { MealFood } from '../../models/meal-food';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-foods-search',
  templateUrl: './foods-search.component.html',
  styleUrl: './foods-search.component.scss'
})
export class FoodsSearchComponent implements OnInit {

  searchControl = new FormControl();
  allFoods: Food[] = [];
  filteredFoods: Food[] = [];
  @Input() selectedMealFoods: MealFood[] = [];
  dropdownOpen = false;

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.foodService.getFoods().subscribe(foods => {
      this.allFoods = foods;
      this.filteredFoods = foods;
      this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterFoods(value || '', foods))
      ).subscribe(filteredFoods => this.filteredFoods = filteredFoods);
    });
  }
  filterOptions() {
    this.filteredFoods = this.allFoods.filter(option =>
      option.name.toLowerCase().includes(this.searchControl.value)
    );
  }

  private _filterFoods(value: string, foods: Food[]): Food[] {
    const filterValue = value.toLowerCase();
    return foods.filter(food => food.name.toLowerCase().includes(filterValue));
  }

  toggleDropdown(state: boolean) {
    this.dropdownOpen = state;
  }

  selectOption(food: Food) {
    this.selectedMealFoods.push(new MealFood(food, 0));
    this.searchControl = new FormControl();
    this.dropdownOpen = false;
  }
}
