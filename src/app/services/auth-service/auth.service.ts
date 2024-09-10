import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {StorageService} from "../storage-service/storage.service";
import {MessageService} from "../message-service/message.service";

const AUTH_API = 'http://localhost:8080/bodybuddy/v1/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedInSource: BehaviorSubject<boolean> = new BehaviorSubject(this.storageService.isLoggedIn());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSource.asObservable();

  constructor(private http: HttpClient,
              private storageService: StorageService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap((data: any) => {
        this.storageService.saveUser(data);
        this.isLoggedInSource.next(true);
      })
    );
  }

  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        role
      },
      httpOptions
    );
  }

  logout(): void {
    this.storageService.clear();
    this.isLoggedInSource.next(false);
  }

  isAdmin(): boolean {
    return this.storageService.getUser().role == 'ROLE_ADMIN';
  }

  isModerator(): boolean {
    return this.storageService.getUser().role == 'ROLE_MODERATOR' || this.storageService.getUser().role == 'ROLE_ADMIN';
  }

  // logout(): Observable<any> {
  //   return this.http.post(AUTH_API + 'signout', {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  //     .pipe(
  //       tap(() => {
  //         this.storageService.clear();
  //         this.isLoggedInSource.next(false);
  //       })
  //     );
  // }
}
