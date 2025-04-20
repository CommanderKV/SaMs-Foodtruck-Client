import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';
import { not } from 'rxjs/internal/util/not';


@Component({
  selector: 'app-create-ingredient',
  imports: [ AdminNavComponent, PhotoUploadComponent, NgIf, FormsModule, NgClass ],
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

  @ViewChild("mainContainer") mainContainer!: ElementRef;
  messageClass: string = "";
  message: string = "";
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
      // Ingredient wasn't found, redirect to inventory page
      error: (error: any) => {
        // Redirect to inventory page
        window.location.href = "/admin/invin";
      }
    });
  }

  // Set the base64 string format of the image.
  setImage(data: string) {
    this.photo = data;
  }

  // Notify the user of something
  notify(message: string, className: string, redirect: boolean = false) {
    const container = document.querySelector("#mainContainer");
    if (container) {
      container.scrollTop = 0;
    }

    // Check if we need to redirect
    if (redirect) {
      this.message = message + " Going back to inventory...";
      this.messageClass = className;

      // Redirect to inventory page after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/invin";
      }, 4000); // Redirect after 4 seconds
    
    // If not redirecting, just set the message and class
    } else {
      this.message = message;
      this.messageClass = className; 
    }
  }

  // Method called when editing an 
  // ingredient and wanting to delete it
  deleteItem() {
    // Check if we are editing an ingredient
    if (this.editing) {
      // Delete the ingredient
      this.service.deleteIngredient(this.id).subscribe({
        next: (response: any) => {
          // Check if the response is successful
          if (response.status === "success") {
            this.notify("Ingredient deleted successfully!", "msg-success", true);

          } else {
            // Failed to delete the ingredient
            this.notify("Failed to delete ingredient", "msg-error");
          }
        },
        error: (error: any) => {
          // Failed to delete the ingredient
          this.notify("Failed to delete ingredient", "msg-error");

          // Log the error for debugging
          console.error(error);
        }
      });
    }
  }

  // Method called when wanting to 
  // save an ingredient
  saveItem() {
    // Check for required fields
    if (this.name === "") {
      this.notify("Name is required", "msg-error");
      return;
    }

    // Save the ingredient data
    let data = {
      name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
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
            this.notify("Ingredient updated successfully!", "msg-success", true);
          
          } else {
            // Failed to update the ingredient
            this.notify("Failed to update ingredient", "msg-error");
          }
        },
        error: (error: any) => {
          // Failed to update the ingredient
          this.notify("Failed to update ingredient", "msg-error");
          console.error(error);
        }
      });

    } else {
      // Create a new ingredient
      this.service.createIngredient(data).subscribe({
        next: (response: any) => {
          // Check if the response is successful
          if (response.status === "success") {
            this.notify("Ingredient created successfully!", "msg-success", true);

          } else {
            // Failed to create the ingredient
            this.notify("Failed to create ingredient", "msg-error");
          }
        },
        error: (error: any) => {
          // Failed to create the ingredient
          this.notify("Failed to create ingredient", "msg-error");

          // Log the error for debugging
          console.error(error);
        }
      });
    }
  }
}
