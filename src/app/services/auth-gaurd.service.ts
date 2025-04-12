import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {
  // Get the server URL from the environment file
  private serverUrl = environment.serverUrl;

  constructor(private router: Router, private authService: AuthService) {}
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.getRoleRaw().subscribe({
        next: (response: any) => {
          if (response.status === "failure") {
            this.router.navigate(["/login"]);
            resolve(false);
          } else {
            if (response.data.role === "admin") {
              resolve(true);
            } else {
              this.router.navigate(["/login"]);
              resolve(false);
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching role:', error);
          this.router.navigate(["/login"]);
          resolve(false);
        }
      });
    });
  }
}
