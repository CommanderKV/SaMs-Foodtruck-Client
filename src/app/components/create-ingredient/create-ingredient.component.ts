import { Component } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-create-ingredient',
  imports: [ AdminNavComponent, PhotoUploadComponent, NgIf, FormsModule ],
  templateUrl: './create-ingredient.component.html',
  styleUrl: './create-ingredient.component.css'
})
export class CreateIngredientComponent {
  name: string = '';
  description: string = '';
  productLink: string | undefined = undefined;
  currentStock: number = 0;
  photo: string | undefined = undefined;
  photoUrl: string = 'imgs/logo.png';
  price: number = 0;

  editing: boolean = false;


  // Method called when editing an 
  // ingredient and wanting to delete it
  deleteItem() {}

  // Method called when wanting to 
  // save an ingredient
  saveItem() {
    let data = {
      name: this.name,
      description: this.description,
      quantity: this.currentStock,
      photo: this.photo,
      productLink: this.productLink,
      price: this.price
    };
    // Check if we are editing or not
    if (this.editing) {
      // Update the ingredient
    } else {
      // Create a new ingredient
    }
  }
}
