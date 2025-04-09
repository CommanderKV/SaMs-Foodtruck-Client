import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-order',
  imports: [ FormsModule ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  // Define the properties for the order
  cartId: number | undefined = undefined;
  firstName: string | undefined = undefined;
  lastName: string | undefined = undefined;
  email: string | undefined = undefined;
  phone: string | undefined = undefined;

  // Inject required services
  constructor(private service: OrderService) { }

  // Method to create an order
  createOrder() {
    // Create the required input object
    const order = {
      cartId: this.cartId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phone
    }

    // Call the service to create the order
    this.service.createOrder(order).subscribe((response: any) => {
      // Handle the response from the server
      console.log(response);
      alert("Order Created Successfully!");
    });

  }

}
