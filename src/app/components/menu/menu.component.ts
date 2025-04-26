import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgClass } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-menu',
  imports: [ NgFor, NgClass, NgIf, FormsModule, NavComponent ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  // Example location
  location: string = "Victoria Park Station";

  // Search text
  searchItem: string = "";

  // Example menu items
  menuItems: {
    category: string, 
    items: {
      id: number,
      imageUrl: string, 
      name: string, 
      price: number, 
      description: string
    }[]
  }[] | null = null;


  // Inject the ProductService dependency into the component
  constructor(private productService: ProductService) { }

  // Load the products
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        // Make sure it was a success
        if (data.status != "success") {
          console.log("Error: " + data.error);
          return;
        }

        // Get the return from the server
        let products = data.data;

        // Check if there are any products
        if (products.length == 0) {
          console.log("No products found");
          return;
        }

        // Go through the products and add them to the menu items
        for (let i = 0; i < products.length; i++) {
          // Get the product
          let product = products[i];

          // Get the categories
          let categories = product.categories;
          if (categories === undefined || categories.length == 0) {
            // Make a category called Miscellaneous
            categories = [{name: "Miscellaneous"}];
          }

          // Add the product to the menu
          for (let j = 0; j < categories.length; j++) {
            // Get the category name
            let categoryName = categories[j].name;

            // Check if the category already exists
            let categoryIndex = -1;
            if (this.menuItems !== null) {
              categoryIndex = this.menuItems.findIndex((item) => item.category === categoryName);
            } else {
              this.menuItems = [];
            }
            if (categoryIndex == -1) {
              // Create a new category
              this.menuItems.push({
                category: categoryName,
                items: []
              });

              // Update index
              categoryIndex = this.menuItems.length - 1;
            }

            // Add the product to the category
            this.menuItems[categoryIndex].items.push({
              imageUrl: `imgs/${product.photo}`,
              name: product.name,
              price: product.price,
              description: product.description,
              id: product.id
            });
          }
        }

        // Sort to make sure that the miscellaneous category is at the end
        if (this.menuItems !== null) {
          this.menuItems.sort((a, b) => {
            if (a.category === "Miscellaneous") {
              return 1;
            } else if (b.category === "Miscellaneous") {
              return -1;
            } else {
              return a.category.localeCompare(b.category);
            }
          });
        }
      },
      error: (error: any) => {
        console.log("Error: " + error);
      }
    });
  }


  shopItem(id: number) {
    // Redirect to the shop page with the item id
    window.location.href = "/shop/" + id;
  }
}
