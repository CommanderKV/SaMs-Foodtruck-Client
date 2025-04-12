import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, AdminNavComponent, NgIf],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'SAMs-Food Truck';

  admin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Call the auth service to update user data
    this.authService.updateData();

    // Check if the user is an admin and redirect accordingly
    if (this.authService.getRole() === 'admin') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }
}
