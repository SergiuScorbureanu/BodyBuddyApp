import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import { StorageService } from './services/storage-service/storage.service';
import { EventBusService } from './shared/event-bus.service';
import {MessageService} from "./services/message-service/message.service";
import {UserDetails} from "./models/google-auth-classes/user-details";
import {ApiService} from "./services/api-service/api-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  role: string = '';
  isLoggedIn$:Observable<boolean> = new Observable<false>;
  showAdminBoard = false;
  showModeratorBoard = false;
  username$:Observable<string> = new Observable<string>;
  userDetails: UserDetails | null = null;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private apiService: ApiService,
    private eventBusService: EventBusService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    //this.storageService.clean();
    const code = this.getQueryParam('code');
    if (code) {
      this.apiService.getToken(code).subscribe(success => {
        if (success) {
          this.loadUserDetails();
          this.router.navigate(['/home']);
        } else {
          console.error('Error fetching token', code);
        }
      });
    } else {
      this.loadUserDetails();
    }

    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const user = this.storageService.getUser();
        if(user && user.role) {
          this.role = user.role;
          this.username$ = of(user.username);
        }
      }
    });

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  private loadUserDetails(): void {
    this.apiService.getPrivate('/user-details').subscribe(
      (data: UserDetails) => {
        this.userDetails = data;
        this.authService.isLoggedInSource.next(true);
      },
      (error: any) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.cleanUp();
    this.messageService.showSuccess('Logged out successfully!');
    this.router.navigate(['/home']);
  }

  // logout(): void {
  //   this.authService.logout().subscribe({
  //     next: res => {
  //       this.cleanUp();
  //       this.messageService.showSuccess('Logged out successfully!');
  //       // this.eventBusService.emit(new EventData('logout', null));
  //     },
  //     error: err => {
  //       console.log('err', err);
  //     },
  //     complete: () => {
  //       this.cleanUp();
  //     }
  //   });
  // }

  private cleanUp(): void {
    this.storageService.clean();
    this.apiService.clearToken();
    // localStorage.clear();
    // localStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.showAdminBoard = false;
    this.showModeratorBoard = false;
  }

  private getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
}
