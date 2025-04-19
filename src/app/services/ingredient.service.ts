import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  // Setup the server URL
  private serverUrl: string = environment.serverUrl;

  // Inject the HttpClient into the service
  constructor(private http: HttpClient) { }

  // Get all ingredients
  getIngredients() {
    return this.http.get(`${this.serverUrl}/ingredients`);
  }

  // Get a specific ingredient by ID
  getIngredient(id: string) {
    return this.http.get(`${this.serverUrl}/ingredients/${id}`);
  }

  // Create a new ingredient
  createIngredient(ingredient: any) {
    return this.http.post(`${this.serverUrl}/ingredients/create`, ingredient);
  }

  // Update an existing ingredient
  updateIngredient(id: string, ingredient: any) {
    return this.http.put(`${this.serverUrl}/ingredients/update/${id}`, ingredient);
  }

  // Delete an ingredient
  deleteIngredient(id: string) {
    return this.http.delete(`${this.serverUrl}/ingredients/delete/${id}`);
  }

}
