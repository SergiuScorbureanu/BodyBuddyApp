import {MealFood} from "./meal-food";

export class Meal {
    id?: string;
    userId?: string;
    date?: string;
    foods: MealFood[] = [];
    mealType: string = '';
    calories: number = 0;
    carbohydrates: number = 0;
    fat: number = 0;
    protein: number = 0;

    constructor() {}
}
