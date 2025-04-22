import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient) { }

  // Get the categories
  getCategories() {
    return this.http.get(`${this.serverUrl}/categories`);
  }

  // Get a category by ID
  getCategory(id: number) {
    return this.http.get(`${this.serverUrl}/categories/${id}`);
  }

  // Create a new category
  createCategory(category: { name: string, description: string}) {
    return this.http.post(`${this.serverUrl}/categories/create`, category, { withCredentials: true });
  }

  // Update an existing category
  updateCategory(id: number, category: { name: string, description: string }) {
    return this.http.put(`${this.serverUrl}/categories/update/${id}`, category, { withCredentials: true });
  }

  // Delete a category
  deleteCategory(id: number) {
    return this.http.delete(`${this.serverUrl}/categories/delete/${id}`, { withCredentials: true });
  }
}
