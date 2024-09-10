import {DisplayFood} from "./display-food";

export class DisplayMeal {
  id?: string;
  userId?: string;
  date?: string;
  foods: DisplayFood[] = [];
  mealType: string = '';
  calories: number = 0;
  carbohydrates: number = 0;
  fat: number = 0;
  protein: number = 0;

  constructor() {}
}
