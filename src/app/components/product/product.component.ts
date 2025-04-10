import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [ FormsModule ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  // Define the properties for the product
  name: string | undefined = undefined;
  description: string | undefined = undefined;
  price: number | undefined = undefined;
  photo: string | undefined = undefined;

  // Inject required services
  constructor(private service: ProductService) { }

  // Handle the photo selection event
  onFileSelected(event: any) {
    // Check if the file exists
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // Get the file and make a FileReader object
    const file = input.files[0];
    const reader = new FileReader();

    // Get the base64 string of the selected file
    reader.onload = (e: any) => {
      this.photo = e.target.result;
    }

    // Read the file
    reader.readAsDataURL(file);
  }

  // Method to create a product
  createProduct() {
    // Create the required input object
    const product = {
      name: this.name,
      description: this.description,
      price: this.price,
      photo: this.photo
    }

    // Call the service to create the product
    this.service.createProduct(product).subscribe((response: any) => {
      // Handle the response from the server
      console.log(response);
      alert("Product Created Successfully!");
    });
  }
}
