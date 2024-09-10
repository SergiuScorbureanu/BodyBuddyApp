import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home.component';
import { RegisterComponent } from './components/register-component/register.component';
import { LoginComponent } from './components/login-component/login.component';
import { ProfileComponent } from './components/profile-component/profile.component';
import { UserParamComponent } from './components/user-param-component/user-param.component';
import { DiaryComponent } from './components/diary-component/diary.component';
import { FoodsSearchComponent } from './components/foods-search-component/foods-search.component';
import { CreateMealComponent } from './components/create-meal-component/create-meal.component';
import {
  NutritionalCalculatorComponent
} from "./components/nutritional-calculator-component/nutritional-calculator.component";
import {CreateFoodComponent} from "./components/create-food-component/create-food.component";
import {AdminDashboardComponent} from "./components/admin-dashboard-component/admin-dashboard.component";
import {GoogleAuthLoginComponent} from "./components/google-auth-login/google-auth-login.component";
import {AdminGuard} from "./guards/AdminGuard";
import {ModeratorGuard} from "./guards/ModeratorGuard";

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'google-auth', component: GoogleAuthLoginComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'user-params', component: UserParamComponent},
  { path: 'diary', component: DiaryComponent},
  { path: 'foods', component: FoodsSearchComponent},
  { path: 'create-meal', component: CreateMealComponent},
  { path: 'calculator', component: NutritionalCalculatorComponent},
  { path: 'create-food', component: CreateFoodComponent, canActivate:[ModeratorGuard]},
  { path: 'dashboard', component: AdminDashboardComponent, canActivate:[AdminGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
