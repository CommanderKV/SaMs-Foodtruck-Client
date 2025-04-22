import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-menu',
  imports: [ AdminNavComponent, FormsModule, NgIf, NgFor, RouterLink ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  searchItem: string = "";
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.data.map((item: any) => {
          item.display = true;
          return item;
        });
      },
      error: (error: any) => {
        console.error("Error fetching products:", error);
      }
    });
  }
  
  // Search for an item in the menu
  search(): void {
    // Check if the search item is empty
    if (this.searchItem === "") {
      // Display all items
      this.products.forEach(item => {
        item.display = true;
      });

    } else {
      // Only display items that match the search value
      this.products.forEach(item => {
        // Show values that match the search value
        if (item.name.toLowerCase().includes(this.searchItem.toLowerCase())) {
          item.display = true;

        // Hide items that do not match the search value
        } else {
          item.display = false;
        }
      })
    }
  }

  editItem(id: string): void {
    window.location.href = `/admin/product?id=${id}`;
  }
}
