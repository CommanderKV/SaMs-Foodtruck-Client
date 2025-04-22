import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  imports: [ AdminNavComponent, RouterLink, FormsModule, NgFor, NgIf ],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  searchItem: string = "";
  categories: {
    id: number | undefined, 
    name: string, 
    display: boolean,
    displayOptions: boolean,
    items: {
      id: number,
      name: string,
      photo: string
    }[]
  }[] = [ {
    id: undefined, 
    name: "Miscellaneous", 
    display: true, 
    displayOptions: false, 
    items: []
  } ];

  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Get the categories from the server
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        // Check if the request was successful
        if (data.status != "success") {
          console.log("Error: " + data.error);
          return;
        }

        // Get the categories from the response
        data.data.forEach((category: any) => {
          this.categories.push({
            id: category.id,
            name: category.name,
            display: true,
            displayOptions: false,
            items: []
          });
        });
      },
      error: (error) => {
        console.log("Error: " + error);
      }
    });

    // Add the products to the categories
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        // Check if the request was successful
        if (data.status != "success") {
          console.log("Error: " + data.error);
          return;
        }

        // Get the products from the response
        let products = data.data;

        // Add the products to the categories
        products.forEach((product: any) => {
          // Get the categories for the product
          let categories = product.categories;
          if (categories === undefined || categories.length == 0) {
            // Make a category called Miscellaneous
            categories = [{name: "Miscellaneous"}];
          }

          // Add the product to the categories
          categories.forEach((category: any) => {
            // Find the category in the list of categories
            let cat = this.categories.find((cat: any) => cat.name == category.name);
            if (cat) {
              // Add the product to the category
              cat.items.push({
                id: product.id,
                name: product.name,
                photo: `imgs/${product.photo }`
              });
            }
          });
        });
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  search() {}

  // Redirect user to the edit page for the category
  editItem(id: number) {
    window.location.href = `/admin/category?id=${id}`;
  }

  // Redirect the user to the edit page for the product
  editProduct(id: number) {
    window.location.href = `/admin/product?id=${id}`;
  }
}
