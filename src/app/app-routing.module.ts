import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home.component';
import { RegisterComponent } from './components/register-component/register.component';
import { LoginComponent } from './components/login-component/login.component';
import { ProfileComponent } from './components/profile-component/profile.component';
import { CaloriesCalculatorComponent } from './components/calories-calculator-component/calories-calculator.component';
import { UserParamComponent } from './components/user-param-component/user-param.component';
import { MealComponent } from './components/meal-component/meal.component';
import { FoodComponent } from './components/food-component/food.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user-params', component: UserParamComponent },
  { path: 'calculator', component: CaloriesCalculatorComponent },
  { path: 'meals', component: MealComponent },
  { path: 'foods', component: FoodComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
