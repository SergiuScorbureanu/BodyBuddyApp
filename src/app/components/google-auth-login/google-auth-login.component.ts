import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api-service/api-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-google-auth-login',
  templateUrl: './google-auth-login.component.html',
  styleUrl: './google-auth-login.component.scss'
})
export class GoogleAuthLoginComponent implements OnInit {

  url: string = "";

  constructor(
    private apiService: ApiService,
    private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/home']);
    } else {
      this.apiService.getAuth("/auth/url").subscribe((data: any) => this.url = data.authURL);
    }
  }

  login(role: string) {
    localStorage.setItem('authRole', role);
    window.location.href = this.url;
  }

}
