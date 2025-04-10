import { Component } from '@angular/core';
import { ProductOrderService } from '../../services/product-order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-orders',
  imports: [ FormsModule ],
  templateUrl: './product-orders.component.html',
  styleUrl: './product-orders.component.css'
})
export class ProductOrdersComponent {
  
  // Define the properties for the product order
  quantity: number | undefined = undefined;
  price: number | undefined = undefined;
  productId: number | undefined = undefined;

  // Inject required services
  constructor(private service: ProductOrderService) { }

  createProductOrder() {
    // Create the required input object
    const productOrder = {
      quantity: this.quantity,
      price: this.price,
      productId: this.productId
    }

    // Call the service to create the product order
    this.service.createProductOrder(productOrder).subscribe((response: any) => {
      // Handle the response from the server
      console.log(response);
      alert("Product Order Created Successfully!");
    });
  }
}
