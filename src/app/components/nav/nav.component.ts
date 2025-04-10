import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [ RouterLink, NgIf ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  // Set the data for the nav bar
  username: string | undefined;

  // Inject the authorization service
  constructor(private service: AuthService) {}


  ngOnInit(): void {
    // Check auth service for global username
    this.service.username.subscribe((username) => {
      this.username = username;
    })
  }

}
