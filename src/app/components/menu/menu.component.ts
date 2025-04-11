import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [ NgFor ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  location: string = "Victoria Park Station";

  // Example menu items
  menuItems: {category: string, items: {imageUrl: string, name: string, price: number, description: string}[]}[] = [
    {
      category: "Burgers",
      items: [
        {imageUrl: "imgs/logo.png", name: "Cheeseburger", price: 10.99, description: "A classic cheeseburger with lettuce, tomato, and cheese."},
        {imageUrl: "imgs/logo.png", name: "Bacon Burger", price: 12.99, description: "A juicy burger topped with crispy bacon."},
      ]
    },
    {
      category: "Drinks",
      items: [
        {imageUrl: "imgs/logo.png", name: "Cola", price: 1.99, description: "Refreshing cola drink."},
        {imageUrl: "imgs/logo.png", name: "Lemonade", price: 2.49, description: "Freshly squeezed lemonade."},
      ]
    },
    {
      category: "Sides",
      items: [
        {imageUrl: "imgs/logo.png", name: "Fries", price: 3.99, description: "Crispy golden fries."},
        {imageUrl: "imgs/logo.png", name: "Onion Rings", price: 4.49, description: "Crispy onion rings."},
      ]
    },
    {
      category: "Desserts",
      items: [
        {imageUrl: "imgs/logo.png", name: "Ice Cream", price: 2.99, description: "Creamy vanilla ice cream."},
        {imageUrl: "imgs/logo.png", name: "Brownie", price: 3.49, description: "Rich chocolate brownie."},
      ]
    }
  ]
}
