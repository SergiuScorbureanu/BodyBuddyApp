import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserParam } from '../../models/user-param';
import { UserService } from '../../services/user-service/user.service';
import { StorageService } from '../../services/storage-service/storage.service';
import { Router } from '@angular/router';
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-user-param',
  templateUrl: './user-param.component.html',
  styleUrl: './user-param.component.scss'
})
export class UserParamComponent implements OnInit{

  userParamForm!: FormGroup;
  isSuccessful: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
    ) {}

  ngOnInit() {
    this.userParamForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(1)]],
      birthDay: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      trainingType: ['', [Validators.required]],
      weightGoal: ['', [Validators.required]],
      weightChangeRate: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.userParamForm.valid) {
      const userId = this.storageService.getLoggedInUserId();
      if (userId) {
        const payload = {
          userId: userId,
          ...this.userParamForm.value,
        };

        console.log('Detalii user param:', payload);

        this.userService.createUserParam(payload).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.isSuccessful = true;
            this.messageService.showSuccess('Successfully created!');
            this.router.navigate(['/diary']);
          },
          error: (error) => {
            //this.errorMessage = error.error.message;
            console.error('Error:', error);
            this.messageService.showError('Error');
          }
        });
      } else {
        // this.errorMessage = 'User is not logged in';
        console.error('User is not logged in');
        this.messageService.showError('User is not logged in');
      }
    } else {
      // this.errorMessage = 'Form is not valid';
      console.error('Form is not valid');
      this.messageService.showError('Form is not valid');

    }
  }
}
