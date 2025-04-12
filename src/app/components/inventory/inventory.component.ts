import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-inventory',
  imports: [ AdminNavComponent, FormsModule, RouterLink ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  // Create a variable to hold the search item
  searchItem: string = "";
}
