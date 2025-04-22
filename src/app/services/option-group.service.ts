import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptionGroupService {

  private serverUrl: string = environment.serverUrl;

  constructor(private http: HttpClient) { }

  // Get the option groups
  getOptionGroups() {
    return this.http.get(`${this.serverUrl}/option-groups`);
  }

  // Create a new option group
  createOptionGroup(optionGroup: { sectionName: string, multipleChoice: boolean, productId: number }) {
    return this.http.post(`${this.serverUrl}/optionGroups/create`, optionGroup, { withCredentials: true });
  }

  // Add an option to an option group
  addOptionToOptionGroup(optionGroupId: number, optionId: number) {
    return this.http.post(`${this.serverUrl}/optionGroups/${optionGroupId}/options`, { optionId: optionId }, { withCredentials: true });
  }
}
