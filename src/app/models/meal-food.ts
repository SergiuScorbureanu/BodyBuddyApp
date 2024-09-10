import {Food} from "./food";

export class MealFood {

  food: Food;
  quantity: number;

  constructor(food: Food, quantity: number) {
    this.food = food;
    this.quantity = quantity;
  }
}
