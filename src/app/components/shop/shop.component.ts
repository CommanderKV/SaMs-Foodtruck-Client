import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, productType } from '../../services/product.service';

@Component({
  selector: 'app-shop',
  imports: [ NavComponent, FormsModule, NgFor, NgIf ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  // Product details
  productImageUrl: string = "";
  productTitle: string = "";
  productDescription: string = "";
  productPrice: number = 0.00;
  productDetails: {
    title: string,
    multipleChoice: boolean,
    required: boolean,
    items: {
      name: string,
      price: number,
      selected: boolean,
      quantity: number,
      maxQuantity: number,
      minQuantity: number,
    }[],
    selectedItem: number | null
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Get the product ID from the route parameters
    this.route.queryParamMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        // Get the data from the API
        this.getValues(Number.parseInt(id));
      
      // Navigate back to the menu page if no ID is found
      } else {
        window.location.href = "/menu";
      }
    });
  }

  // Get the product data from the API
  getValues(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (serviceResponse: any) => {
        // Get the response data
        const data: productType = serviceResponse as productType;
        
        // Check if the data retrieval was successful
        if (data.status === "success") {
          // Get the data from the response
          const response = data.data;

          // Set the product details
          this.productImageUrl = `imgs/${response.photo}`;
          this.productTitle = response.name;
          this.productDescription = response.description;
          this.productPrice = response.price;

          // Set the options from the optionGroup
          if (response.optionGroups) {
            // Add the option group to the product details
            for (const optionGroup of response.optionGroups) {
              let group: {
                title: string, 
                multipleChoice: boolean,
                required: boolean,
                items: {
                  name: string,
                  price: number,
                  selected: boolean,
                  quantity: number,
                  maxQuantity: number,
                  minQuantity: number,
                }[],
                selectedItem: number | null
              } = {
                title: optionGroup.sectionName,
                multipleChoice: optionGroup.multipleChoice,
                required: optionGroup.required,
                items: [],
                selectedItem: null
              };

              // Set the options in the optionGroup
              for (const option of optionGroup.options) {
                const item = {
                  name: option.ingredient.name,
                  price: option.priceAdjustment,
                  selected: option.default,
                  quantity: option.defaultQuantity,
                  maxQuantity: option.maxQuantity,
                  minQuantity: option.minQuantity,
                };

                // Add the option to the group
                group.items.push(item);
              }

              // Add the group to the product details
              this.productDetails.push(group);
            }
          }

        }
      },
      error: (error: any) => {
        // Handle the error
        console.error("Error retrieving product data:", error);
        // Redirect to the menu page if there is an error
        window.location.href = "/menu";
      }
    });
  }

}
