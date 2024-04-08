import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home-component/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register-component/register.component';
import { LoginComponent } from './components/login-component/login.component';
import { ProfileComponent } from './components/profile-component/profile.component';
import { BoardUserComponent } from './components/board-user-component/board-user.component';
import { CaloriesCalculatorComponent } from './components/calories-calculator-component/calories-calculator.component';
import { HttpRequestInterceptor } from './helpers/http.interceptor';
import { UserParamComponent } from './components/user-param-component/user-param.component';
import { MealComponent } from './components/meal-component/meal.component';
import { FoodComponent } from './components/food-component/food.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BoardUserComponent,
    CaloriesCalculatorComponent,
    UserParamComponent,
    MealComponent,
    FoodComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
