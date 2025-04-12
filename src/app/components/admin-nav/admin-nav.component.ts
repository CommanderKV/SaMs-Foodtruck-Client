import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-nav',
  imports: [ NgIf, RouterLink ],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent implements OnInit {

  // Set the username for the admin nav bar
  username: string | undefined;

  // Inject the authorization service
  constructor(private service: AuthService) {}

  ngOnInit(): void {
    // We can run the following as each time a 
    // component is loaded, the ngOnInit method is called
    // and this nav will only be used in authenticated endpoints

    // Check if the user is an admin
    this.service.updateData();
    
    this.service.role.subscribe((role) => {
      // User is not an admin, redirect to dashboard
      if (role !== 'admin') {
        // Redirect to the dashboard if not an admin
        window.location.href = '/dashboard';
      }
    });

    // Check auth service for global username
    this.service.username.subscribe((username) => {
      this.username = username;
    });
  }
}
