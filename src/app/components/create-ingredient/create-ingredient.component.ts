import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';


@Component({
  selector: 'app-create-ingredient',
  imports: [ AdminNavComponent, PhotoUploadComponent, NgIf, FormsModule ],
  templateUrl: './create-ingredient.component.html',
  styleUrl: './create-ingredient.component.css'
})
export class CreateIngredientComponent implements OnInit {
  name: string = '';
  description: string | undefined = undefined;
  productLink: string | undefined = undefined;
  currentStock: number = 0;
  photo: string | undefined = undefined;
  photoUrl: string = "imgs/logo.png";
  price: number = 0;

  editing: boolean = false;
  private id: string = '';

  // Inject the necessary services
  constructor(private route: ActivatedRoute, private service: IngredientService) {}

  ngOnInit() {
    // Get the ID parameter from the route
    this.route.queryParamMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        // Get the values from the API
        this.getValues(id);
      }
    });
  }

  // Update the existing values
  getValues(id: string) {
    this.service.getIngredient(id).subscribe({
      next: (response: any) => {
        // Check if the response is successful
        if (response.status === "success") {
          // Set values from the response
          let data = response.data;
          this.editing = true;
          this.id = data.id;

          // Set the values
          this.name = data.name;
          this.description = data.description || undefined;
          this.productLink = data.productLink || undefined;
          this.currentStock = data.quantity || 0;
          this.photoUrl = `imgs/${data.photo}`;
          this.price = data.price || 0;
        }
      },
      error: (error: any) => {
        // Tell user the ingredient was not found
        alert("Ingredient was not found. Going back to inventory.");

        // Redirect to inventory page
        window.location.href = "/admin/invin";
      }
    });
  }

  // Set the base64 string format of the image.
  setImage(data: string) {
    this.photo = data;
  }

  // Method called when editing an 
  // ingredient and wanting to delete it
  deleteItem() {}

  // Method called when wanting to 
  // save an ingredient
  saveItem() {
    // Save the ingredient data
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
      this.service.updateIngredient(this.id, data).subscribe({
        next: (response: any) => {
          // Check if the response is successful
          if (response.status === "success") {
            alert("Ingredient updated successfully!");
            window.location.href = "/admin/invin";
          } else {
            alert("Failed to update ingredient");
          }
        },
        error: (error: any) => {
          console.error(error);
          alert("Failed to update ingredient");
        }
      });

    } else {
      // Create a new ingredient
      this.service.createIngredient(data).subscribe({
        next: (response: any) => {
          // Check if the response is successful
          if (response.status === "success") {
            alert("Ingredient created successfully!");
            window.location.href = "/admin/invin";
          } else {
            alert("Failed to create ingredient");
          }
        },
        error: (error: any) => {
          console.error(error);
          alert("Failed to create ingredient");
        }
      });
    }
  }
}
