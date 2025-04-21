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
  changes: {id: string, quantity: number}[] = [];

  constructor(private service: IngredientService) {}

  ngOnInit() {
    this.service.getIngredients().subscribe({
      next: (data: any) => {
        // Check if successful response
        if (data.status === "success") {
          // Assign the data to the ingredients variable
          this.ingredients = data.data;
          this.ingredients.forEach(item => {
            // Set the display property to true
            item.display = true;
          });
        }
      },
      error: (error: any) => {
        // Handle error response
        console.error("Error fetching ingredients:", error);
        alert("Error fetching ingredients. Please try again later.");
      }
    });
  }

  // Search for an item in the inventory
  search() {
    // Check if the search item is empty
    if (this.searchItem === "") {
      // Display all items
      this.ingredients.forEach(item => {
        item.display = true;
      });

    } else {
      // Only display items that match the search value
      this.ingredients.forEach(item => {
        // Show values that match the search value
        if (item.name.toLowerCase().includes(this.searchItem.toLowerCase())) {
          item.display = true;

        // Hide items that do not match the search value
        } else {
          item.display = false;
        }
      })
    }
  }

  // Check if the user has unsaved changes
  canDeactivate(): boolean {
    // Check if there are unsaved changes
    const unsavedChanges = this.changes.length > 0;
    
    // Ask the user if they want to continue
    if (unsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to save and continue?")) {
        // Save changes
        return this.saveChanges();
      }
    }

    // Continue on without saving changes
    return true;
  }

  // Save the changes to the database
  saveChanges(): boolean {
    // Check if there are any changes to save
    if (this.changes.length === 0) {
      return true; // No changes to save
    }

    // Go through each change
    let success = true;
    this.changes.forEach(change => {
      // Update the ingredient in the database
      this.service.updateIngredient(change.id, {quantity: change.quantity}).subscribe({
        next: (response: any) => {
          // Check if successful response
          if (response.status !== "success") {
            // Handle error response
            alert("Failed to save changes. Please try again later.");
            success = false;
          } else {
            // Remove the change from the changes array
            this.changes = this.changes.filter(item => item.id !== change.id);
          }
        },
        error: (error: any) => {
          success = false;
          // Handle error response
          console.error("Error saving changes:", error);
          alert("Error saving changes. Please try again later.");
        }
      });
    });

    return success;
  }

  // Decrease the quantity of an item
  decreaseQuantity(id: string, pos: number) {
    // Check to see if it will be a valid quantity change
    if (this.ingredients[pos].quantity - 1 < 0) {
      return;
    }

    // Decrease the value in the input field by 1
    this.ingredients[pos].quantity -= 1;

    // Update the ingredient quantity in the changes
    const existingChange = this.changes.find(change => change.id === id);
    if (existingChange) {
      existingChange.quantity = this.ingredients[pos].quantity;
    } else {
      this.changes.push({id: id, quantity: this.ingredients[pos].quantity});
    }
  }

  // Increase the quantity of an item
  increaseQuantity(id: string, pos: number) {
    // Increase the value in the input field by 1
    this.ingredients[pos].quantity += 1;

    // Update the ingredient quantity in the changes
    const existingChange = this.changes.find(change => change.id === id);
    if (existingChange) {
      existingChange.quantity = this.ingredients[pos].quantity;
    } else {
      this.changes.push({id: id, quantity: this.ingredients[pos].quantity});
    }
  }

  // Set the quantity of an item
  setQuantity(id: string, quantity: number, pos: number) {
    if (quantity < 0 || quantity === null) {
      return;
    }
    // Set the value in the input field to the new quantity
    this.ingredients[pos].quantity = quantity;

    // Set the quantity of the item in the changes
    const existingChange = this.changes.find(change => change.id === id);
    if (existingChange) {
      existingChange.quantity = quantity;
    } else {
      this.changes.push({id: id, quantity: quantity});
    }
  }


  goToItemPurchasePage(link: string) {
    // Navigate to the item purchase page
    window.location.href = link;
  }


  editItem(id: string) {
    // Navigate to the item edit page
    window.location.href = `admin/ingredient?id=${id}`;
  }


}

