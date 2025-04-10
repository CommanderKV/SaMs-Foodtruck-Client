import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [ FormsModule ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  // Define the properties for the cart
  orderTotal: number | undefined = undefined;
  userId: string | undefined = undefined;

  // Define the properties for adding a product order
  cartId: number | undefined = undefined;
  productOrderId: number | undefined = undefined;

  // Inject required services
  constructor(private service: CartService) { }

  // Method to create a cart
  createCart() {
    // Create the required input object
    const cart = {
      orderTotal: this.orderTotal,
      userId: this.userId
    }

    // Call the service to create the cart
    this.service.createCart(cart).subscribe((response: any) => {
      // Handle the response from the server
      console.log(response);
      alert("Cart Created Successfully!");
    });
  }

  // Method to add the product order to the cart
  addProductOrder() {
    // Check input
    if (this.cartId === undefined || this.productOrderId === undefined) {
      alert("Please enter all required fields.");
      return;
    }
    
    // Create the required input object
    const details = {
      cartId: this.cartId,
      productOrderId: this.productOrderId
    }
    
    // Call the service to add the product order to the cart
    this.service.addProductToCart(details).subscribe((response: any) => {
      // Handle the response from the server
      console.log(response);
      alert("Product Added to Cart Successfully!");
    });
  }
}
