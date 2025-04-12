import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-login',
  imports: [ NgIf, NavComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Login or signup
  login: boolean = true;

  // Inject the auth service to use the login function
  constructor(private authService: AuthService) {}

  // Google login
  google(): void {
    // Call the login function for google
    this.authService.googleLogin();
  }

}
