import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { IngredientService } from '../../services/ingredient.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-inventory',
  imports: [ AdminNavComponent, FormsModule, RouterLink, NgFor, NgIf ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  // Create a variable to hold the search item
  searchItem: string = "";
  ingredients: any[] = [];


  constructor(private service: IngredientService) {}

  ngOnInit() {
    this.service.getIngredients().subscribe({
      next: (data: any) => {
        // Check if successful response
        if (data.status === "success") {
          // Assign the data to the ingredients variable
          this.ingredients = data.data;
        }
      },
      error: (error: any) => {
        // Handle error response
        console.error("Error fetching ingredients:", error);
        alert("Error fetching ingredients. Please try again later.");
      }
    });
  }


  decreaseQuantity(id: string) {

  }

  increaseQuantity(id: string) {

  }

  goToItemPurchasePage(link: string) {
    // Navigate to the item purchase page
    window.location.href = link;
  }

  editItem(id: string) {
    // Navigate to the item edit page
    window.location.href = `admin/createIngredient?id=${id}`;
  }


}

