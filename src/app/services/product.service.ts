import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Get the server url from the environment file
  serverUrl: string = environment.serverUrl;

  // Inject the HttpClient dependency into the service
  constructor(private http: HttpClient) { }

  // Method to get all products
  getProducts() {
    return this.http.get(`${this.serverUrl}/products`);
  }

  // Method to get a product by ID
  getProductById(id: number) {
    return this.http.get(`${this.serverUrl}/products/${id}`);
  }

  // Delete a product by ID
  deleteProduct(id: number) {
    return this.http.delete(`${this.serverUrl}/products/delete/${id}`, { withCredentials: true });
  }

  // Method to create a new product
  createProduct(product: any) {
    return this.http.post(`${this.serverUrl}/products/create`, product, { withCredentials: true });
  }
  
  // Update a product by ID
  updateProduct(id: number, product: { name?: string, description?: string, photo?: string, price?: number }) {
    return this.http.put(`${this.serverUrl}/products/update/${id}`, product, { withCredentials: true });
  }


  ////////////////
  // Categories //
  ////////////////
  addCategoryToProduct(productId: number, categoryId: number) {
    return this.http.post(`${this.serverUrl}/products/${productId}/categories`, { id: categoryId }, { withCredentials: true });
  }
  removeCategoryFromProduct(productId: number, categoryId: number) {
    return this.http.delete(`${this.serverUrl}/products/${productId}/categories/${categoryId}`, { withCredentials: true });
  }

  //////////////////
  // Option group //
  //////////////////
  addOptionGroupToProduct(productId: number, optionGroupId: number) {
    return this.http.post(`${this.serverUrl}/products/${productId}/optionGroups`, { id: optionGroupId });
  }
  removeOptionGroup(productId: number, optionGroupId: number) {
    return this.http.delete(`${this.serverUrl}/products/${productId}/optionGroups/${optionGroupId}`);
  }


  /////////////////
  // Ingredients //
  /////////////////
  addIngredientToProduct(productId: number, link: { id: number, quantity: number, measurement: string }) {
    return this.http.post(`${this.serverUrl}/products/${productId}/ingredients`, link, { withCredentials: true });
  }
  removeIngredientFromProduct(productId: number, ingredientId: number) {
    return this.http.delete(`${this.serverUrl}/products/${productId}/ingredients/${ingredientId}`, { withCredentials: true });
  }
  updateIngredientInProduct(productId: number, ingredient: {
    id: number,
    quantity: number,
    measurement: string
  }) {
    return this.http.put(`${this.serverUrl}/products/${productId}/ingredients`, ingredient, { withCredentials: true });
  }


}
