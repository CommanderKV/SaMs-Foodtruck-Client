import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { FormsModule } from '@angular/forms';
import { IngredientService } from '../../services/ingredient.service';
import { ProductService } from '../../services/product.service';
import { OptionGroupService } from '../../services/option-group.service';
import { OptionService } from '../../services/option.service';
import { CategoryService } from '../../services/category.service';
import { lastValueFrom } from 'rxjs';

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
  id: number = -1;
  name: string = "";
  description: string | undefined = undefined;
  photoUrl: string = "imgs/logo.png";
  photo: string | undefined = undefined;
  price: number | undefined = undefined;

  types: any[] = [ "Main", "Side", "Drink"];
  type: string[] = [];
  units: string[] = [ "g", "kg", "oz", "lb", "ml", "l", "cup", "tbsp", "tsp" ];
  allIngredients: {
    id: number,
    name: string,
    description: string,
    quantity: number,
    photo: string,
    productLink: string,
    price: number
  }[] = [];
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
  allCategories: {id: number, name: string, description: string}[] = [];
  categories: { id: number, name: string }[] = [];

  messageClass: string = "";
  message: string = "";
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private ingredientService: IngredientService,
    private productService: ProductService,
    private optionGroupService: OptionGroupService,
    private optionService: OptionService,
    private categoryService: CategoryService,
  ) {}

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

    // Get the categories from the API
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        if (data.status === "success") {
          this.allCategories = data.data;
        }
      },
      error: (error: any) => {
        console.error("Error fetching categories:", error);
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
  getValues(id: string) {
    this.productService.getProductById(Number.parseInt(id)).subscribe({
      next: (response: any) => {
        if (response.status !== "success") {
          this.notify("Error fetching product", "msg-error", true);
          return;
        }
        let data = response.data;
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.photoUrl = `imgs/${data.photo}`;
        this.price = data.price;
        if (data.ingredients) {
          this.ingredients = data.ingredients.map((ingredient: any) => {
            return {
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.measurement
            }
          });
        }
        if (data.categories) {
          this.categories = data.categories.map((category: any) => {
            return {
              id: category.id,
              name: category.name
            }
          });
        }
        if (data.optionGroups) {
          this.groups = data.optionGroups.map((group: any) => {
            return {
              name: group.sectionName,
              toppings: group.options.map((option: any) => {
                return {
                  id: option.ingredient.id,
                  name: option.ingredient.name,
                  included: false,
                  minQuantity: option.minQuantity,
                  defaultQuantity: option.defaultQuantity,
                  maxQuantity: option.maxQuantity,
                  priceAdjustment: option.priceAdjustment
                }
              })
            }
          });
        }

        this.editing = true;
      },
      error: (error: any) => {
        console.error("Error fetching product:", error);
        this.notify("Error fetching product", "msg-error", true);
      }
    });
  }

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
  deleteItem() {
    // Confirm they want to delete the product
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    // Delete the product
    this.productService.deleteProduct(this.id).subscribe({
      next: (response: any) => {
        if (response.status !== "success") {
          this.notify("Error deleting product", "msg-error");
          return;
        }
        this.notify("Product deleted successfully", "msg-success", true);
      },
      error: (error: any) => {
        console.error("Error deleting product:", error);
        this.notify("Error deleting product", "msg-error");
      }
    });
  }

  // Save the product
  async saveItem() {
    try {
      // Var to check if the product was created successfully
      let created = true;

      ////////////////////
      // Create product //
      ////////////////////
      let product = {
        name: this.name,
        description: this.description,
        photo: this.photo,
        price: this.price,
      };
      let productId: number = -1;
      const productResponse: any = await lastValueFrom(this.productService.createProduct(product)); 
      if (productResponse.status !== "success") {
        this.notify("Error creating product", "msg-error");
        created = false;
      } else {
        productId = productResponse.data.id;
      }

      // If we failed to make a product then return
      if (!created) return;


      ///////////////////////////////////////
      // Add the categories to the product //
      ///////////////////////////////////////
      this.categories.forEach(async category =>{
        const categoryAddingResponse: any = await lastValueFrom(this.productService.addCategoryToProduct(productId, category.id));
        if (categoryAddingResponse.status !== "success") {
          this.notify("Error adding category to product", "msg-error");
          created = false;
        }
      });

      // If we failed to add the categories then return
      if (!created) return;


      //////////////////////////
      // Create option groups //
      //////////////////////////
      this.groups.forEach(async group => {
        // Create the group
        let optionGroup = {
          id: -1,
          sectionName: group.name,
          multipleChoice: false, 
          productId: productId
        }
        const optionGroupCreation: any = await lastValueFrom(this.optionGroupService.createOptionGroup(optionGroup));
        if (optionGroupCreation.status !== "success") {
          this.notify("Error creating option group", "msg-error");
          created = false;
        } else {
          optionGroup.id = optionGroupCreation.data.id;
        }
        
        // Add the options
        group.toppings.forEach(async topping => {
          // Create a new option
          let option = {
            priceAdjustment: topping.priceAdjustment,
            defaultQuantity: topping.defaultQuantity,
            minQuantity: topping.minQuantity,
            maxQuantity: topping.maxQuantity,
            ingredientId: topping.id
          }
          const createOptionResponse: any = await lastValueFrom(this.optionService.createOption(option));
          if (createOptionResponse.status !== "success") {
            this.notify("Error creating option", "msg-error");
            created = false;
          } else {
            topping.id = createOptionResponse.data.id;
          }

          // If we failed to create the option then return
          if (!created) return;


          // Add the option to the group
          const addOptionToGroup: any = await lastValueFrom(this.optionGroupService.addOptionToOptionGroup(optionGroup.id, topping.id));
          if (addOptionToGroup.status !== "success") {
            this.notify("Error adding option to group", "msg-error");
            created = false;
          }

          // If we failed to add the option to the group then return
          if (!created) return;
        });

        // Link the option group to the product
        const addOptionGroupToProductResponse: any = await lastValueFrom(this.productService.addOptionGroupToProduct(productId, optionGroup.id));
        if (addOptionGroupToProductResponse.status !== "success") {
          this.notify("Error adding option group to product", "msg-error");
          created = false;
        }
      });


      /////////////////////
      // Add ingredients //
      /////////////////////
      this.ingredients.forEach(async ingredient => {
        let data = {
          id: ingredient.id,
          quantity: ingredient.quantity,
          measurement: ingredient.unit
        }
        const addIngredientToProductResponse: any = await lastValueFrom(this.productService.addIngredientToProduct(productId, data));
        if (addIngredientToProductResponse.status !== "success") {
          this.notify("Error adding ingredient to product", "msg-error");
          created = false;
        }

        // If we failed to add the ingredient then return
        if (!created) return;
      });
    } catch (error) {
      console.error("Error saving product:", error);
      this.notify("Error saving product", "msg-error");
    }

    /////////////////////////////////////////
    // Inform user creation was successful //
    /////////////////////////////////////////
    this.notify("Product created successfully", "msg-success");
  }


}
