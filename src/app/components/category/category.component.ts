import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [AdminNavComponent, NgClass, FormsModule, NgIf],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  // Category details
  name: string = "";
  description: string = "";

  // Message details
  messageClass: string = "";
  message: string = "";
  
  // Editing details
  id: number = 0;
  editing: boolean = false;

  constructor(private route: ActivatedRoute, private service: CategoryService) {}

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

  // Notify the user of something
  notify(message: string, className: string, redirect: boolean = false) {
    const container = document.querySelector("#mainContainer");
    if (container) {
      container.scrollTop = 0;
    }

    // Check if we need to redirect
    if (redirect) {
      this.message = message + " Going back to categories...";
      this.messageClass = className;

      // Redirect to inventory page after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/categories";
      }, 2500); // Redirect after 2.5 seconds
    
    // If not redirecting, just set the message and class
    } else {
      this.message = message;
      this.messageClass = className; 
    }
  }

  // Update the existing values
  getValues(id: string) {
    this.service.getCategory(Number.parseInt(id)).subscribe({
      next: (response: any) => {
        // Check if the response is successful
        if (response.status === "success") {
          // Set values from the response
          let data = response.data;
          this.name = data.name;
          this.description = data.description;

          // Set the editing values
          this.id = data.id;
          this.editing = true;
        }
      },

      // Category wasn't found, redirect to categories page
      error: (error: any) => {
        this.notify("Category not found", "msg-error", true);
      }
    });
  }



  // Delete the category
  delete() {}

  // Save the category
  save() {
    // Check the values
    if (this.name === "" || this.description === "") {
      this.notify("Please fill in all fields", "alert alert-danger");
      return;
    }

    // Create the category object
    let category = {
      name: this.name,
      description: this.description
    }

    // Create the category if not editing
    if (!this.editing) {
      this.service.createCategory(category).subscribe({
        next: (response: any) => {
          // Check if the response is successful
          if (response.status === "success") {
            // Notify the user of success
            this.notify("Category created successfully", "msg-success", true);
          } else {
            // Notify the user of failure
            this.notify("Category creation failed", "msg-error");
          }
        },
        error: (error: any) => {
          this.notify("Error creating category", "msg-error");
        }
      });
    
    // If editing, update the category
    } else {
      this.service.updateCategory(this.id, category).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            // Notify the user of success
            this.notify("Category updated successfully", "msg-success", true);
          
          // Notify the user of failure
          } else {
            this.notify("Category update failed", "msg-error");
          }
        },
        error: (error: any) => {
          this.notify("Error updating category", "msg-error");
        }
      });
    }
  }

}
