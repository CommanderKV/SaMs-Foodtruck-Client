import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // Get the server url from the environment file
  serverUrl: string = environment.serverUrl;

  googleLogin() {
    // Send user to the login
    window.location.href = `${this.serverUrl}/user/google`
  }

}
