import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private tokenKey = 'authToken';

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public getLoggedInUserId(): string | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  public getToken(): string | null {
    const user = this.getUser();
    return user ? user.accessToken : null;
  }

  public clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
  }
}
