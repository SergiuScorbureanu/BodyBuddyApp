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
import { NutritionalCalculatorComponent } from './components/nutritional-calculator-component/nutritional-calculator.component';
import { HttpRequestInterceptor } from './helpers/http.interceptor';
import { UserParamComponent } from './components/user-param-component/user-param.component';
import { FoodsSearchComponent } from './components/foods-search-component/foods-search.component';
import { CreateMealComponent } from './components/create-meal-component/create-meal.component';
import { DiaryComponent } from './components/diary-component/diary.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ViewMealsComponent } from './components/view-meals-component/view-meals.component';
import { AdminDashboardComponent } from './components/admin-dashboard-component/admin-dashboard.component';
import { CreateFoodComponent } from './components/create-food-component/create-food.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FoodDetailsComponent } from './components/food-details-component/food-details.component';
import {MdbModalModule} from "mdb-angular-ui-kit/modal";
import {ToastrModule} from "ngx-toastr";
import {NgToastModule} from "ng-angular-popup";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgOptimizedImage} from "@angular/common";
import { FoodSearchAdminComponent } from './components/food-search-admin-component/food-search-admin.component';
import { GoogleAuthLoginComponent } from './components/google-auth-login/google-auth-login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    NutritionalCalculatorComponent,
    UserParamComponent,
    DiaryComponent,
    FoodsSearchComponent,
    CreateMealComponent,
    ViewMealsComponent,
    AdminDashboardComponent,
    CreateFoodComponent,
    FoodDetailsComponent,
    FoodSearchAdminComponent,
    GoogleAuthLoginComponent,
  ],
  exports: [
    CreateMealComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FullCalendarModule,
        MdbModalModule,
        NgToastModule,
        ToastrModule.forRoot(),
        NgOptimizedImage,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
