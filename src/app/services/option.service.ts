import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  private serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient) { }

  // Get the options
  getOptions() {
    return this.http.get(`${this.serverUrl}/options`);
  }

  // Create a new option
  createOption(option: {
    priceAdjustment: number, 
    defaultQuantity: number,
    minQuantity: number,
    maxQuantity: number,
    default: boolean,
    ingredientId: number,
  }) {
    return this.http.post(`${this.serverUrl}/options/create`, option, { withCredentials: true });
  }

  // Remove option
  removeOption(optionId: number) {
    return this.http.delete(`${this.serverUrl}/options/delete/${optionId}`, { withCredentials: true });
  }

  // Update option
  updateOption(optionId: number, option: {
    priceAdjustment: number, 
    defaultQuantity: number,
    minQuantity: number,
    maxQuantity: number,
    default: boolean,
    ingredientId: number,
  }) {
    return this.http.put(`${this.serverUrl}/options/update/${optionId}`, option, { withCredentials: true });
  }
}
