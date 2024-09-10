import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user-service/user.service";
import {User} from "../../models/user";
import {MessageService} from "../../services/message-service/message.service";
import {MealService} from "../../services/meal-service/meal.service";
import {FoodService} from "../../services/food-service/food.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  users: User[] = [];
  totalUsers: number = 0;
  totalMeals: number = 0;
  totalFoods: number = 0;

  constructor(
    private userService: UserService,
    private mealService: MealService,
    private foodService: FoodService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMeals();
    this.loadFoods();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.totalUsers = data.length;
    });
  }

  loadMeals() {
    this.mealService.countMeals().subscribe((data) => {
      this.totalMeals = data;
    });
  }

  loadFoods() {
    this.foodService.getFoods().subscribe((data) => {
      this.totalFoods = data.length;
    });
  }

  formatTypes(type: string): string {
    return type ? type.replace('_', ' ') : '';
  }

  deleteUser(userId: string | undefined): void {
    if (userId) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== userId);
        this.messageService.showSuccess('User deletet successfully!')
      });
    } else {
      console.error('User ID is undefined');
      this.messageService.showError('User ID is undefined');
    }
  }
}
