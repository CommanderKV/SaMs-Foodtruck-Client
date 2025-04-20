import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgClass, NgIf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-login',
  imports: [ NgIf, NavComponent, NgClass ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Login or signup
  login: boolean = true;
  loginClass: string = "active";
  signupClass: string = "";

  // Inject the auth service to use the login function
  constructor(private authService: AuthService) {}

  // When the user wants to login
  loginToggle() {
    this.login = true;
    this.loginClass = "active";
    this.signupClass = "";
  }

  // When the user wants to signup
  signupToggle() {
    this.login = false;
    this.loginClass = "";
    this.signupClass = "active";
  }

  // Google login
  google(): void {
    // Call the login function for google
    this.authService.googleLogin();
  }

}
