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

  // Create a new category
  createCategory(category: { name: string, description: string}) {
    return this.http.post(`${this.serverUrl}/categories/create`, category, { withCredentials: true });
  }
}
