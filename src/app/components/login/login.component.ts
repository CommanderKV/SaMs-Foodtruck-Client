import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // Inject the auth service to use the login function
  constructor(private authService: AuthService) {}

  // Google login
  google(): void {
    // Call the login function for google
    this.authService.googleLogin().subscribe({
      next: response => {
        console.log('Login successful:', response);
      },
      error: error => {
        console.error('Login failed:', error);
      }
    });
  }

}
