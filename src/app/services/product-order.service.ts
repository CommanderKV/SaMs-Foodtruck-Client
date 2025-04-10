import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {

  // Get the server url from the environment file
  serverUrl: string = environment.serverUrl;

  // Inject the HttpClient dependency into the service
  constructor(private http: HttpClient) { }

  // Method to create a new productOrder
  createProductOrder(productOrder: any) {
    return this.http.post(`${this.serverUrl}/productOrders/create`, productOrder);
  }
}
