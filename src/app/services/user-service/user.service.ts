import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';

const API_URL = 'http://localhost:8080/bodybuddy/v1/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) {}

  // updateUserData(userId: string, userData: any): Observable<any> {
  //   return this.http.put(API_URL + userId, userData);
  // }

  createUserParam(userParamData: any): Observable<any> {
    return this.http.post('http://localhost:8080/bodybuddy/v1/user_params', userParamData);
  }

  getLoggedInUserId(): string {
    const user = this.storageService.getUser();
    return user && user.id;
  }


  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
}
