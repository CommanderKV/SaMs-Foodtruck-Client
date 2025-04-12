import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-nav',
  imports: [ RouterLink ],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent implements OnInit {

  // Set the username for the admin nav bar
  username: string | undefined = undefined;

  // Inject the authorization service
  constructor(private service: AuthService) {}

  ngOnInit(): void {
    // Update the user data
    this.service.updateData();

    // Get the username from the authorization service
    this.service.username.subscribe((username) => {
      console.log("Admin Nav Username: ", username);
      this.username = username;
    });  
  }
}
