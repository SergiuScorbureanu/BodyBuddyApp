import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastr: ToastrService) {}

  // private messageSource = new BehaviorSubject<string>('');
  // currentMessage = this.messageSource.asObservable();
  //
  // constructor() { }
  //
  // changeMessage(message: string) {
  //   this.messageSource.next(message);
  // }

  showSuccess(succesMessage: string) {
    this.toastr.success(succesMessage, 'Succes Message',{positionClass: 'toast-bottom-right'});
  }

  showError(errorMessage: string) {
    this.toastr.error(errorMessage, 'Error Message',{positionClass: 'toast-bottom-right'});
  }
}
