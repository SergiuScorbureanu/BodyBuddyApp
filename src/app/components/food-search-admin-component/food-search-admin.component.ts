import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Food} from "../../models/food";
import {FoodService} from "../../services/food-service/food.service";
import {FormControl} from "@angular/forms";
import {startWith} from "rxjs/operators";
import {map} from "rxjs";
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-food-search-admin',
  templateUrl: './food-search-admin.component.html',
  styleUrl: './food-search-admin.component.scss'
})
export class FoodSearchAdminComponent implements OnInit {

  searchControl = new FormControl();
  allFoods: Food[] = [];
  filteredFoods: Food[] = [];
  dropdownOpen = false;
  @Output() editFood = new EventEmitter<Food>();

  constructor(
    private foodService: FoodService,
    private messageService: MessageService
  ) { }

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
      option.name.toLowerCase().includes(this.searchControl.value.toLowerCase())
    );
  }

  private _filterFoods(value: string, foods: Food[]): Food[] {
    const filterValue = value.toLowerCase();
    return foods.filter(food => food.name.toLowerCase().includes(filterValue));
  }

  toggleDropdown(state: boolean) {
    this.dropdownOpen = state;
  }

  onEditFood(food: Food) {
    this.editFood.emit(food);
  }

  deleteFood(food: Food) {
    console.log('Delete food:', food);
    this.foodService.deleteFood(food.id!).subscribe({
      next: () => {
        console.log('Food deleted successfully');
        this.messageService.showSuccess('Food deleted successfully!');
        this.filteredFoods = this.filteredFoods.filter(f => f.id !== food.id);
      },
      error: (err) => {
        console.error('Error deleting food', err);
        this.messageService.showError('Error deleting food');
      }
    });
  }
}
