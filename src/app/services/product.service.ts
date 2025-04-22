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

  // Method to add a category to a product
  addCategoryToProduct(productId: number, categoryId: number) {
    return this.http.post(`${this.serverUrl}/products/${productId}/categories`, { id: categoryId }, { withCredentials: true });
  }

  // Remove the category from the product
  removeCategoryFromProduct(productId: number, categoryId: number) {
    return this.http.delete(`${this.serverUrl}/products/${productId}/categories/${categoryId}`, { withCredentials: true });
  }

  // Add an option group to the product
  addOptionGroupToProduct(productId: number, optionGroupId: number) {
    return this.http.post(`${this.serverUrl}/products/${productId}/optionGroups`, { id: optionGroupId });
  }

  // Add an ingredient to the product
  addIngredientToProduct(productId: number, link: {
    id: number,
    quantity: number,
    measurement: string
  }) {
    return this.http.post(`${this.serverUrl}/products/${productId}/ingredients`, link, { withCredentials: true });
  }

  // Update a product by ID
  updateProduct(id: number, product: { name?: string, description?: string, photo?: string, price?: number }) {
    return this.http.put(`${this.serverUrl}/products/update/${id}`, product, { withCredentials: true });
  }

}
