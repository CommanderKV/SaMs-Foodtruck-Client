import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Get the server url from the environment file
  serverUrl: string = environment.serverUrl;

  // Inject the HttpClient dependency into the service
  constructor(private http: HttpClient) { }

  // Method to create a cart
  createCart(cart: any) {
    return this.http.post(`${this.serverUrl}/carts/create`, cart);
  }

  // Method to add a product order to the cart
  addProductToCart(details: {cartId: number, productOrderId: number}) {
    return this.http.post(`${this.serverUrl}/carts/${details.cartId}/products`, {productOrderId: details.productOrderId});
  }
}
