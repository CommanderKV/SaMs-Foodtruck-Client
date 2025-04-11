import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [ NgFor, NgClass ],
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
        {imageUrl: "imgs/logo.png", name: "Cheeseburger", price: 10.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Bacon Burger", price: 12.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Bacon Burger", price: 12.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ]
    },
    {
      category: "Drinks",
      items: [
        {imageUrl: "imgs/logo.png", name: "Cola", price: 1.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Lemonade", price: 2.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Lemonade", price: 2.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Lemonade", price: 2.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Lemonade", price: 2.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ]
    },
    {
      category: "Sides",
      items: [
        {imageUrl: "imgs/logo.png", name: "Fries", price: 3.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Onion Rings", price: 4.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ]
    },
    {
      category: "Desserts",
      items: [
        {imageUrl: "imgs/logo.png", name: "Ice Cream", price: 2.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {imageUrl: "imgs/logo.png", name: "Brownie", price: 3.49, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      ]
    }
  ]
}
