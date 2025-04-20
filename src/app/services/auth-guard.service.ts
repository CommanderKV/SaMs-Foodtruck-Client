import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  // Inject the router and auth service
  constructor(private router: Router, private authService: AuthService) {}
  
  // Activate the route if the user is an admin
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if the user is logged in
      this.authService.getRoleRaw().subscribe({
        next: (response: any) => {
          // Check if the request failed
          if (response.status === "failure") {
            this.router.navigate(["/login"]);
            resolve(false);
          } else {
            // Check if the user is an admin
            if (response.data.role === "admin") {
              resolve(true);
            
            // Check if the user is a customer
            } else {
              this.router.navigate(["/login"]);
              resolve(false);
            }
          }
        },
        error: (error: any) => {
          // Log error
          console.error('Error fetching role:', error);
          this.router.navigate(["/login"]);
          resolve(false);
        }
      });
    });
  }
}
