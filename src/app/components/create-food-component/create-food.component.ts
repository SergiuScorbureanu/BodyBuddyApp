import {Component} from '@angular/core';
import {FoodService} from "../../services/food-service/food.service";
import {Food} from "../../models/food";
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.component.html',
  styleUrl: './create-food.component.scss'
})
export class CreateFoodComponent{
  food: Food = new Food();
  showForm: boolean = false;
  editMode: boolean = false;

  constructor(
    private foodService: FoodService,
    private messageService: MessageService
  ) {}

  addFood(): void {
    this.foodService.createFood(this.food).subscribe({
      next: (newFood) => {
        console.log('Food added successfully', newFood);
        this.messageService.showSuccess('Food added successfully!');
        this.resetForm();
        this.showForm = false;
      },
      error: (err) => {
        console.error('Error adding food', err);
        this.messageService.showError('Error adding food');
      }
    });
  }

  updateFood(): void {
    this.foodService.updateFood(this.food.id!, this.food).subscribe({
      next: (updatedFood) => {
        console.log('Food updated successfully', updatedFood);
        this.messageService.showSuccess('Food updated successfully!');
        this.resetForm();
        this.showForm = false;
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating food', err);
        this.messageService.showError('Error updating food');
      }
    });
  }

  onSubmit(): void {
    if (this.editMode) {
      this.updateFood();
    } else {
      this.addFood();
    }
  }

  resetForm(): void {
    this.food = new Food();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
      this.editMode = false;
    }
  }

  onMeasurementUnitChange(): void {
    if (this.food.measurementUnit === 'grams' || this.food.measurementUnit === 'milliliters') {
      this.food.quantity = 100;
    } else if (this.food.measurementUnit === 'piece') {
      this.food.quantity = 1;
    }
  }

  loadFoodForEdit(food: Food): void {
    this.food = { ...food };
    this.editMode = true;
    this.showForm = true;
  }
}
