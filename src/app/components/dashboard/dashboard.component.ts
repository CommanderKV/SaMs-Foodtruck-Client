import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    // Call the auth service to update user data
    this.authService.updateData();

    this.authService.role.subscribe((role) => {
      if (role === 'admin') {
        window.location.href = '/admin';
      }
      console.log(role);
    });
  }
}
