import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Get the server url from the environment file
  private serverUrl: string = environment.serverUrl;

  // Setup cartCount to be shared across components
  private cartCountSource = new BehaviorSubject<number>(0);

  // Other components can subscribe to this observable to get the cart count
  cartCount = this.cartCountSource.asObservable();

  // Update the global cart count
  setCartCount(count: number): void {
    this.cartCountSource.next(count);
  }

  // Reset the global cart count
  clearCartCount(): void {
    this.cartCountSource.next(0);
  }

  // Inject the HttpClient dependency into the service
  constructor(private http: HttpClient) { }

  // Method to create a cart
  createCart(cart: any) {
    return this.http.post(`${this.serverUrl}/carts/create`, cart);
  }

  // Method to add a product order to the cart
  addProductToCart(details: {cartId: number, productOrderId: number}) {
    // Add the product cart
    const response = this.http.post(`${this.serverUrl}/carts/${details.cartId}/products`, {productOrderId: details.productOrderId});
    
    // Increment the cart count
    this.cartCountSource.next(this.cartCountSource.value + 1);
    
    // Return the response from the API call
    return response;
  }
}
