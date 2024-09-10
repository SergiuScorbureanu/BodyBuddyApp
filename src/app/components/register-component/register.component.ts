import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form: any = {
    username: null,
    email: null,
    password: null,
    role: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private messageService: MessageService) { }

  onSubmit(): void {
    const { username, email, password, role } = this.form;

    this.authService.register(username, email, password, role).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.messageService.showSuccess('User registered successfully!');
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.messageService.showError('Register failed!');
        this.isSignUpFailed = true;
      }
    });
  }
}
