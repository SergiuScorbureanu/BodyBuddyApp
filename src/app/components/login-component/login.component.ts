import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { StorageService } from '../../services/storage-service/storage.service';
import { Router } from '@angular/router';
import {EventBusService} from "../../shared/event-bus.service";
import {EventData} from "../../shared/event.class";
import {Observable} from "rxjs";
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  };

  isLoggedIn$:Observable<boolean> = new Observable<false>;
  isLoginFailed = false;
  errorMessage = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private eventBusService: EventBusService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    if (this.storageService.isLoggedIn()) {
      this.role = this.storageService.getUser().role;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.role = this.storageService.getUser().role;
        this.messageService.showSuccess('Logged in successfully');
        this.eventBusService.emit(new EventData('login', data));
        //this.router.navigate(['home']);
        //this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.messageService.showError('Login failed!');
        this.isLoginFailed = true;
      }
    });
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '');
  }

  // reloadPage(): void {
  //   window.location.reload();
  // }
}
