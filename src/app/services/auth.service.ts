import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Get the server URL from the environment file
  private serverUrl = environment.serverUrl;

  // Setup vars to be shared across components
  private usernameSource = new BehaviorSubject<string | undefined>(undefined);
  username = this.usernameSource.asObservable();

  private roleSource = new BehaviorSubject<string | undefined>(undefined);
  role = this.roleSource.asObservable();

  // Update the global username
  setUsername(username: string): void {
    this.usernameSource.next(username);
  }

  // Remove the global username on logout
  clearUsername(): void {
    this.usernameSource.next(undefined);
  }

  // Get global role
  getRole(): string | undefined {
    return this.roleSource.getValue();
  }

  // Update the global role
  setRole(role: string): void {
    this.roleSource.next(role);
  }

  // Remove the global role on logout
  clearRole(): void {
    this.roleSource.next(undefined);
  }

  // Update the user data
  updateData() {
    // Get the user data from the server
    return this.http.get(`${this.serverUrl}/user`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        // If the response is successful, set the username
        if (response && response.data.displayName) {
          this.setUsername(response.data.displayName);
          this.setRole(response.data.role);
        } else {
          this.clearUsername();
          this.clearRole();
        }
      },
      error: () => {
        // If there is an error, clear the username
        this.clearUsername();
        this.clearRole();
      }
    });
  }

  // Inject the HTTP client to make API calls
  constructor(private http: HttpClient) {}

  // Google login function
  googleLogin() {
    // Redirect to the Google login page
    window.location.href = `${this.serverUrl}/user/google`;
  }

  // Logout function
  logout() {
    // Pass authToken so the api server can remove it
    return this.http.get(`${this.serverUrl}/user/logout`, { withCredentials: true });
  }
}
