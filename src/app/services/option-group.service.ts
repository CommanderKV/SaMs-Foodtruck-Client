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
  createOptionGroup(optionGroup: any) {
    return this.http.post(`${this.serverUrl}/optionGroups/create`, optionGroup, { withCredentials: true });
  }

  // Delete option group
  deleteOptionGroup(optionGroupId: number) {
    return this.http.delete(`${this.serverUrl}/optionGroups/delete/${optionGroupId}`, { withCredentials: true });
  }

  // Update option group
  updateOptionGroup(optionGroupId: number, optionGroup: { sectionName: string, multipleChoice: boolean, required: boolean }) {
    return this.http.put(`${this.serverUrl}/optionGroups/update/${optionGroupId}`, optionGroup, { withCredentials: true });
  }

  // Add an option to an option group
  addOptionToOptionGroup(optionGroupId: number, optionId: number) {
    return this.http.post(`${this.serverUrl}/optionGroups/${optionGroupId}/options`, { optionId: optionId }, { withCredentials: true });
  }

  // Remove an option from an option group
  removeOptionFromOptionGroup(optionGroupId: number, optionId: number) {
    return this.http.delete(`${this.serverUrl}/optionGroups/${optionGroupId}/options/${optionId}`, { withCredentials: true });
  }
}
