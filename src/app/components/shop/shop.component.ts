import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, productType } from '../../services/product.service';
import { ReceiptComponent, ReceiptType } from "../receipt/receipt.component";

@Component({
  selector: 'app-shop',
  imports: [NavComponent, FormsModule, NgFor, NgIf, ReceiptComponent],
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
      subDetails: {
        name: string,
        price: number,
        selected: boolean,
        quantity: number,
        maxQuantity: number,
        minQuantity: number
      }[] | null
    }[],
    selectedItem: number | null
  }[] = [];
  orderData: { 
    receipt: ReceiptType, 
    final: boolean 
  } | undefined = undefined;
  quantity: number = 1;

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

        // Update the receipt
        this.updateReceipt();
      
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
                  subDetails: {
                    name: string,
                    price: number,
                    selected: boolean,
                    quantity: number,
                    maxQuantity: number,
                    minQuantity: number
                  }[] | null
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
                  subDetails: null
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

  // Check if the product is selected
  isSelected(detailPos: number, itemPos: number): boolean {
    // Get the details pos
    const detail = this.productDetails[detailPos];

    // Get the item pos
    const item = detail.items[itemPos];

    // Check if the detail is selected
    if (detail.selectedItem == itemPos || item.selected) {
      return true;
    } else {
      return false;
    }
  }

  // Update the receipt
  updateReceipt() {
    let receipt: ReceiptType = {
      name: this.productTitle,
      price: this.productPrice,
      quantity: this.quantity,
      details: []
    }
    // Go through each product detail
    for (const product of this.productDetails) {
      let pos = 0;
      // Go through each item in the product details
      for (const item of product.items) {
        if (!item.selected || product.selectedItem != pos) {
          pos++;
          continue;
        }

        // Set the item details
        let itemDetail = {
          name: item.name,
          price: item.price,
          quantity: item.quantity ? 1 : item.quantity,
          subDetails: [] as {
            name: string,
            price: number,
            quantity: number
          }[]
        }

        // Check if there are any sub items
        if (item.subDetails) {
          for (const subItem of item.subDetails) {
            // Check if the sub item is selected
            if (subItem.selected) {
              // Set the sub item details
              let subItemDetail = {
                name: subItem.name,
                price: subItem.price,
                quantity: subItem.quantity ? 1 : subItem.quantity
              }

              // Add the sub item to the item details
              itemDetail.subDetails.push(subItemDetail);
            }
          }
        }

        // Add the item details to the receipt
        receipt.details.push(itemDetail);
        pos++;
      }
    }

    // Set the order data
    this.orderData = {
      receipt: receipt,
      final: false
    }
  }
}
