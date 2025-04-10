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

  // Setup username to be shared across components
  private usernameSource = new BehaviorSubject<string | undefined>(undefined);

  // Other components can subscribe to this observable to get the username
  username = this.usernameSource.asObservable();

  // Update the global username
  setUsername(username: string): void {
    this.usernameSource.next(username);
  }

  // Remove the global username on logout
  clearUsername(): void {
    this.usernameSource.next(undefined);
  }

  // Inject the HTTP client to make API calls
  constructor(private http: HttpClient) {}

  // Google login function
  googleLogin() {
    // Call the login endpoint on the server
    return this.http.get(`${this.serverUrl}/user/google`, { withCredentials: true });
  }

  // Logout function
  logout() {
    // Pass authToken so the api server can remove it
    return this.http.get(`${this.serverUrl}/user/logout`, { withCredentials: true });
  }
}
