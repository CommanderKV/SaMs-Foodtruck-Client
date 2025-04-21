import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { FormsModule } from '@angular/forms';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-product',
  imports: [ 
    AdminNavComponent, 
    PhotoUploadComponent, 
    FormsModule, 
    NgClass, 
    NgIf, 
    NgFor 
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  // Define the properties for the product
  name: string = "";
  description: string | undefined = undefined;
  photoUrl: string = "imgs/logo.png";
  photo: string | undefined = undefined;
  price: number | undefined = undefined;
  availableStock: number = 0;

  types: any[] = [ "Main", "Side", "Drink"];
  type: string[] = [];
  units: string[] = [ "g", "kg", "oz", "lb", "ml", "l", "cup", "tbsp", "tsp" ];
  allIngredients: any[] = [];
  ingredients: { id: number, name: string, quantity: number, unit: string }[] = [];
  groups: {name: string, toppings: { 
    id: number, 
    name: string, 
    included: boolean,
    minQuantity: number, 
    defaultQuantity: number, 
    maxQuantity: number, 
    priceAdjustment: number 
  }[]}[] = [];
  allCategories: {id: number, name: string}[] = [ 
    { id: 0, name: "Main" },
    { id: 1, name: "Side" },
    { id: 2, name: "Drink" },
    { id: 3, name: "Dessert" },
    { id: 4, name: "Appetizer" },
    { id: 5, name: "Sauce" },
    { id: 6, name: "Condiment" },
    { id: 7, name: "Snack" },
    { id: 8, name: "Other" }
  ];
  categories: { id: number, name: string }[] = [];

  messageClass: string = "";
  message: string = "";
  editing: boolean = false;

  constructor(private route: ActivatedRoute, private ingredientService: IngredientService) {}

  // If were editing a product get the values
  ngOnInit() {
    // Get the ID parameter from the route
    this.route.queryParamMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        // Get the values from the API
        this.getValues(id);
      }
    });

    // Get the ingredients from the API
    this.ingredientService.getIngredients().subscribe({
      next: (data: any) => {
        this.allIngredients = data.data;
      },
      error: (error: any) => {
        console.error("Error fetching ingredients:", error);
      }
  });
  }

  // Notify the user of something
  notify(message: string, className: string, redirect: boolean = false) {
    const container = document.querySelector("#mainContainer");
    if (container) {
      container.scrollTop = 0;
    }

    // Check if we need to redirect
    if (redirect) {
      this.message = message + " Going back to menu...";
      this.messageClass = className;

      // Redirect to menu page after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/menu";
      }, 2500); // Redirect after 2.5 seconds
    
    // If not redirecting, just set the message and class
    } else {
      this.message = message;
      this.messageClass = className; 
    }
  }

  // Update the displayed values
  getValues(id: string) {}

  // Set the base64 string format of the image.
  setImage(data: string) {
    this.photo = data;
  }

  decreaseQuantity(pos: number) {
    const ingredient = this.ingredients[pos];
    if (ingredient.quantity > 0) {
      ingredient.quantity--;
    } else {
      this.notify("Quantity cannot be less than 0", "msg-error");
    }
  }

  increaseQuantity(pos: number) {
    const ingredient = this.ingredients[pos];
    ingredient.quantity++;
  }

  setQuantity(pos: number, quantity: number) {
    const ingredient = this.ingredients[pos];
    if (quantity < 0) {
      this.notify("Quantity cannot be less than 0", "msg-error");
    } else {
      ingredient.quantity = quantity;
    }
  }

  // Add the ingredient to the list
  addIngredient(value: Event) {
    const input = value.target as HTMLInputElement;
    const id = input.value;
    if (id) {
      const ingredient = this.allIngredients.find(ingredient => ingredient.id === Number.parseInt(id));
      if (ingredient) {
        this.ingredients.push({ 
          id: Number.parseInt(id), 
          name: ingredient.name, 
          quantity: 0, 
          unit: ""
        });
        input.value = "";
      }
    }
  }

  // Remove the ingredient from the list
  removeIngredient(pos: number) {
    this.ingredients.splice(pos, 1);
  }

  // Returns a list of ingredients that are not already in use
  get filteredIngredients() {
    return this.allIngredients.filter(ingredient => {
      return !this.ingredients.some(item => item.name === ingredient.name);
    });
  }


  // Add the topping to the list
  addTopping(groupPos: number, value: Event) {
    const input = value.target as HTMLInputElement;
    const id = input.value;
    if (id) {
      const topping = this.allIngredients.find(topping => topping.id === Number.parseInt(id));
      if (topping) {
        this.groups[groupPos].toppings.push({ 
          id: Number.parseInt(id), 
          name: topping.name, 
          included: false,
          minQuantity: 0, 
          defaultQuantity: 0, 
          maxQuantity: 10, 
          priceAdjustment: 0
        });
        input.value = "";
      }
    }
  }

  // Remove the topping from the list
  removeTopping(groupPos: number, pos: number) {
    this.groups[groupPos].toppings.splice(pos, 1);
  }

  filteredToppings(groupPos: number) {
    return this.allIngredients.filter(topping => {
      return !this.groups[groupPos].toppings.some(item => item.name === topping.name);
    });
  }

  /////////////////////////////
  // Min quantity operations //
  /////////////////////////////
  increaseMinQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (topping.minQuantity + 1 > topping.maxQuantity) {
      this.notify("Minimum quantity cannot be greater than maximum quantity", "msg-error");
    } else if (topping.minQuantity + 1 > topping.defaultQuantity) {
      this.notify("Minimum quantity cannot be greater than default quantity", "msg-error");
    } else {
      topping.minQuantity++;
    }
  }
  decreaseMinQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (topping.minQuantity - 1 < 0) {
      this.notify("Minimum quantity cannot be less than 0", "msg-error");
    } else {
      topping.minQuantity--;
    }
  }
  setMinQuantity(groupPos: number, pos: number, quantity: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (quantity < 0) {
      this.notify("Minimum quantity cannot be less than 0", "msg-error");
    } else if (quantity > this.groups[groupPos].toppings[pos].maxQuantity) {
      this.notify("Minimum quantity cannot be greater than maximum quantity", "msg-error");
    } else {
      topping.minQuantity = quantity;
    }
  }

  /////////////////////////////////
  // Default quantity operations //
  /////////////////////////////////
  increaseDefaultQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (topping.defaultQuantity + 1 > topping.maxQuantity) {
      this.notify("Default quantity cannot be greater than maximum quantity", "msg-error");
    } else {
      topping.defaultQuantity++;
    }
  }
  decreaseDefaultQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (topping.defaultQuantity - 1 < topping.minQuantity) {
      this.notify("Default quantity cannot be less than minimum quantity", "msg-error");
    } else if (topping.defaultQuantity < 0) {
      this.notify("Default quantity cannot be less than 0", "msg-error");
    } else {
      topping.defaultQuantity--;
    }
  }
  setDefaultQuantity(groupPos: number, pos: number, quantity: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (quantity < 0) {
      this.notify("Default quantity cannot be less than 0", "msg-error");
    } else if (quantity > topping.maxQuantity) {
      this.notify("Default quantity cannot be greater than maximum quantity", "msg-error");
    } else if (quantity < topping.minQuantity) {
      this.notify("Default quantity cannot be less than minimum quantity", "msg-error");
    } else {
      topping.defaultQuantity = quantity;
    }
  }

  /////////////////////////////
  // Max quantity operations //
  /////////////////////////////
  increaseMaxQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    topping.maxQuantity++;
  }
  decreaseMaxQuantity(groupPos: number, pos: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (topping.maxQuantity - 1 < topping.minQuantity) {
      this.notify("Maximum quantity cannot be less than minimum quantity", "msg-error");
    } else if (topping.maxQuantity - 1 < topping.defaultQuantity) {
      this.notify("Maximum quantity cannot be less than default quantity", "msg-error");
    } else {
      topping.maxQuantity--;
    }
  }
  setMaxQuantity(groupPos: number, pos: number, quantity: number) {
    const topping = this.groups[groupPos].toppings[pos];
    if (quantity < 0) {
      this.notify("Maximum quantity cannot be less than 0", "msg-error");
    } else if (quantity < topping.defaultQuantity) {
      this.notify("Maximum quantity cannot be less than default quantity", "msg-error");
    } else if (quantity < topping.minQuantity) {
      this.notify("Maximum quantity cannot be less than minimum quantity", "msg-error");
    } else {
      topping.maxQuantity = quantity;
    }
  }


  /////////////////////////
  // Category operations //
  /////////////////////////
  addCategory(value: Event) {
    const input = value.target as HTMLInputElement;
    const id = input.value;
    if (id) {
      const category = this.allCategories.find(category => category.id === Number.parseInt(id));
      if (category) {
        this.categories.push({ 
          id: Number.parseInt(id), 
          name: category.name
        });
        input.value = "";
      }
    }
  }
  removeCategory(pos: number) {
    this.categories.splice(pos, 1);
  }

  get filteredCategories() {
    return this.allCategories.filter(category => {
      return !this.categories.some(item => item.id === category.id);
    });
  }



  // Add the group to the list
  addGroup() {
    this.groups.push({name: "", toppings: []});
  }

  // Remove the group from the list
  removeGroup(pos: number) {
    this.groups.splice(pos, 1);
  }

  // Delete the product
  deleteItem() {}

  // Save the product
  saveItem() {}

}
