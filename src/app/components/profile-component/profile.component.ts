import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage-service/storage.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user-service/user.service";
import {MessageService} from "../../services/message-service/message.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  currentUser: any;
  profileForm: FormGroup = this.formBuilder.group({});
  isEditing = false;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.profileForm = this.formBuilder.group({
      username: [this.currentUser.username],
      email: [this.currentUser.email],
      password: ['']
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onUpdateProfile(): void {
    const { username, email, password } = this.profileForm.value;
    const userId = this.currentUser.id;

    if (username !== this.currentUser.username) {
      this.userService.updateUsername(userId, username).subscribe(() => {
        this.currentUser.username = username;
        this.storageService.saveUser(this.currentUser);
        this.messageService.showSuccess('Username updated successfully!');
      });
    }

    if (email !== this.currentUser.email) {
      this.userService.updateEmail(userId, email).subscribe(() => {
        this.currentUser.email = email;
        this.storageService.saveUser(this.currentUser);
        this.messageService.showSuccess('Email updated successfully!');
      });
    }

    if (password) {
      this.userService.updatePassword(userId, password).subscribe(() => {
        this.messageService.showSuccess('The password updated successfully!');
      });
    }

    this.isEditing = false;
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '');
  }
}
