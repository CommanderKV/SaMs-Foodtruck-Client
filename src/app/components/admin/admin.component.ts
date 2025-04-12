import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";

@Component({
  selector: 'app-admin',
  imports: [ AdminNavComponent ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  constructor(private service : AuthService) { }

  ngOnInit() {    
    
  }
}
