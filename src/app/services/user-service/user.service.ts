import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {User} from "../../models/user";
import {ApiService} from "../api-service/api-service";

const API_URL = 'http://localhost:8080/bodybuddy/v1/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
    ) {}

  // updateUserData(userId: string, userData: any): Observable<any> {
  //   return this.http.put(API_URL + userId, userData);
  // }

  createUserParam(userParamData: any): Observable<any> {
    return this.http.post('http://localhost:8080/bodybuddy/v1/user-params', userParamData);
  }

  // getLoggedInUserId(): string {
  //   const user = this.storageService.getUser();
  //   return user && user.id;
  // }

  getUsers(): Observable<User[]> {
    return this.apiService.users.getUsers();
  }

  deleteUser(id: string): Observable<any> {
    return this.apiService.users.deleteUser(id);
  }

  updateUsername(id: string, username: string): Observable<any> {
    return this.apiService.users.updateUsername(id, username);
  }

  updateEmail(id: string, email: string): Observable<any> {
    return this.apiService.users.updateEmail(id, email);
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.apiService.users.updatePassword(id, password);
  }


  // getPublicContent(): Observable<any> {
  //   return this.http.get(API_URL + 'all', { responseType: 'text' });
  // }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  // getModeratorBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'mod', { responseType: 'text' });
  // }
  //
  // getAdminBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'admin', { responseType: 'text' });
  // }
}
