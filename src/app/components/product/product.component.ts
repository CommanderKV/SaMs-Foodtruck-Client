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
  required: boolean = false;
  multipleSelection: boolean = false;

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
  ingredients: { id: number, remove: boolean, name: string, quantity: number, unit: string }[] = [];
  groups: {
    id: number,
    name: string,
    required: boolean,
    multiple: boolean, 
    remove: boolean,
    toppings: { 
      id: number, 
      remove: boolean,
      name: string, 
      included: boolean,
      minQuantity: number, 
      defaultQuantity: number, 
      maxQuantity: number, 
      priceAdjustment: number 
    }[]
  }[] = [];

  allCategories: {id: number, name: string, description: string}[] = [];
  categories: { id: number, name: string, remove: boolean }[] = [];

  beforeEdit: any = {};

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
        this.beforeEdit = data;
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.photoUrl = `imgs/${data.photo}`;
        this.price = data.price;
        if (data.ingredients) {
          this.ingredients = data.ingredients.map((ingredient: any) => {
            return {
              id: ingredient.id,
              remove: false,
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
              name: category.name,
              remove: false,
            }
          });
        }
        if (data.optionGroups) {
          this.groups = data.optionGroups.map((group: any) => {
            return {
              id: group.id,
              name: group.sectionName,
              remove: false,
              toppings: group.options.map((option: any) => {
                return {
                  id: option.ingredient.id,
                  name: option.ingredient.name,
                  included: false,
                  minQuantity: option.minQuantity,
                  defaultQuantity: option.defaultQuantity,
                  maxQuantity: option.maxQuantity,
                  priceAdjustment: option.priceAdjustment,
                  remove: false
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


  ///////////////////////////
  // Ingredient operations //
  ///////////////////////////
  addIngredient(value: Event) {
    // Get the value from the input
    const input = value.target as HTMLInputElement;
    const id = input.value;

    // Check if the value ingredient is already in the list
    const existingIngredient = this.ingredients.find(item => item.id === Number.parseInt(id));
    if (!existingIngredient) {
      // Find the ingredient and add it to the list
      const ingredient = this.allIngredients.find(ingredient => ingredient.id === Number.parseInt(id));
      if (ingredient) {
        this.ingredients.push({ 
          id: Number.parseInt(id), 
          name: ingredient.name, 
          quantity: 0, 
          unit: "",
          remove: false
        });
        input.value = ""; // Clear the input field
      } else {
        this.notify("Ingredient not found", "msg-error");
      }
    } else {
      // Reset the remove value
      existingIngredient.remove = false;
    }
  }
  removeIngredient(pos: number) {
    // Get the ingredient to remove
    const ingredient = this.ingredients[pos];

    // Set the remove value to true
    ingredient.remove = true;
  }
  get filteredIngredients() {
    return this.allIngredients.filter(ingredient => {
      return !this.ingredients.some(item => item.remove == false && item.name === ingredient.name);
    });
  }


  ////////////////////////
  // Topping operations //
  ////////////////////////
  addTopping(groupPos: number, value: Event) {
    // Get the value from the input
    const input = value.target as HTMLInputElement;
    const id = input.value;

    // Check if the topping is already in the list
    const existingTopping = this.groups[groupPos].toppings.find(item => item.id === Number.parseInt(id));

    if (!existingTopping) {
      // Find the topping and add it to the list
      const topping = this.allIngredients.find(topping => topping.id === Number.parseInt(id));
      if (topping) {
        this.groups[groupPos].toppings.push({ 
          id: Number.parseInt(id), 
          name: topping.name, 
          included: false,
          minQuantity: 0, 
          defaultQuantity: 0, 
          maxQuantity: 10, 
          priceAdjustment: 0,
          remove: false
        });
        input.value = ""; // Clear the input field
      } else {
        this.notify("Topping not found", "msg-error");
      }
    } else {
      // Reset the remove value
      existingTopping.remove = false;
    }
  }
  removeTopping(groupPos: number, pos: number) {
    // Get the topping to remove
    const topping = this.groups[groupPos].toppings[pos];

    // Set the remove value to true
    topping.remove = true;
  }
  filteredToppings(groupPos: number) {
    return this.allIngredients.filter(topping => {
      return !this.groups[groupPos].toppings.some(item => item.remove == false && item.name === topping.name);
    });
  }
  displayToppings(groupPos: number): boolean {
    let group = this.groups[groupPos];
    
    return group.toppings.length > 0 && group.toppings.some(topping => !topping.remove);
  }


  /////////////////////////
  // Category operations //
  /////////////////////////
  addCategory(value: Event) {
    // Get the value from the input
    const input = value.target as HTMLInputElement;
    const id = input.value;

    // Check if the category is already in the list
    const existingCategory = this.categories.find(item => item.id === Number.parseInt(id));
    if (!existingCategory) {
      // Find the category and add it to the list
      const category = this.allCategories.find(category => category.id === Number.parseInt(id));

      if (category) {
        this.categories.push({ 
          id: Number.parseInt(id), 
          name: category.name,
          remove: false
        });
        input.value = ""; // Clear the input field
      } else {
        this.notify("Category not found", "msg-error");
      }
    } else {
      // Reset the remove value
      existingCategory.remove = false;
    }
  }
  removeCategory(pos: number) {
    // Get the category to remove
    const category = this.categories[pos];

    // Set the remove value to true
    category.remove = true;
  }
  get filteredCategories() {
    return this.allCategories.filter(category => {
      return !this.categories.some(item => item.remove === false && item.id === category.id);
    });
  }


  //////////////////////
  // Group operations //
  //////////////////////
  addGroup() {
    // Add the group to the list
    this.groups.push({
      id: -1,
      name: "", 
      remove: false, 
      required: false, 
      multiple: false, 
      toppings: [] 
    });
  }
  removeGroup(pos: number) {
    // Get the group to remove
    const group = this.groups[pos];

    // Set the remove value to true
    group.remove = true;
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

      // Set the product
      let product = {
        id: this.id,
        name: this.name,
        description: this.description,
        photo: this.photo,
        price: this.price
      };

      // Decided which command to use
      if (this.editing) {
        // Update the product
        const productResponse: any = await lastValueFrom(this.productService.updateProduct(this.id, product));
        if (productResponse.status !== "success") {
          this.notify("Error updating product", "msg-error");
          return;
        }
      } else {
        // Save the product
        const productResponse: any = await lastValueFrom(this.productService.createProduct(product));
        if (productResponse.status !== "success") {
          this.notify("Error creating product", "msg-error");
          return;
        }
        // Set the product Id
        this.id = productResponse.data.id;
      }

      /////////////////
      // Ingredients //
      /////////////////
      this.ingredients.forEach(async ingredient => {
        // Setup the ingredient data
        let ingredientData = {
          id: ingredient.id,
          quantity: ingredient.quantity,
          measurement: ingredient.unit
        }

        // Updating
        if (this.editing) {
          // Check if the ingredient is being removed
          if (ingredient.remove) {
            // Check if the ingredient was already in the product
            const prevIngredient = this.beforeEdit.ingredients.find((item: any) => item.id === ingredient.id);
            if (prevIngredient) {
              // Remove the ingredient
              const removeIngredientResponse: any = await lastValueFrom(
                this.productService.removeIngredientFromProduct(this.id, ingredient.id)
              );
              if (removeIngredientResponse.status !== "success") {
                this.notify("Error removing ingredient from product", "msg-error");
              }
            }
          } else {
            const updateIngredientResponse: any = await lastValueFrom(
              this.productService.updateIngredientInProduct(this.id, ingredientData)
            );
            if (updateIngredientResponse.status !== "success") {
              this.notify("Error updating ingredient in product", "msg-error");
            }
          }
        
        // Saving
        } else {
          // Only add the ingredient if it was not removed
          if (!ingredient.remove) {
            const addIngredientResponse: any = await lastValueFrom(
              this.productService.addIngredientToProduct(this.id, ingredientData)
            );
            if (addIngredientResponse.status !== "success") {
              this.notify("Error adding ingredient to product", "msg-error");
            }
          }
        }
      });


      ////////////////
      // Categories //
      ////////////////
      this.categories.forEach(async category => {
        // Updating
        if (this.editing) {
          // Being removed
          if (category.remove) {
            // Check if the category was already in the product
            const prevCategory = this.beforeEdit.categories.find((item: any) => item.id === category.id);
            if (prevCategory) {
              // Remove the category
              const removeCategoryResponse: any = await lastValueFrom(
                this.productService.removeCategoryFromProduct(this.id, category.id)
              );
              if (removeCategoryResponse.status !== "success") {
                this.notify("Error removing category from product", "msg-error");
              }
            }
          }

        // Saving
        } else {
          if (!category.remove) {
            const addCategoryResponse: any = await lastValueFrom(
              this.productService.addCategoryToProduct(this.id, category.id)
            );
            if (addCategoryResponse.status !== "success") {
              this.notify("Error adding category to product", "msg-error");
            }
          }
        }
      });


      ////////////
      // Groups //
      ////////////
      this.groups.forEach(async group => {
        // Setup the group data
        let groupData = {
          id: group.id,
          sectionName: group.name,
          multipleChoice: group.multiple, 
          required: group.required,
        }

        // Updating
        if (this.editing) {
          // Remove the group
          if (group.remove) {
            // Check if the group was already in the product
            const prevGroup = this.beforeEdit.optionGroups.find((item: any) => item.id === group.id);
            if (prevGroup) {
              // Remove the option group from the product
              const removeGroupResponse: any = await lastValueFrom(
                this.productService.removeOptionGroup(this.id, group.id)
              );
              if (removeGroupResponse.status !== "success") {
                this.notify("Error removing option group", "msg-error");
              }

              // Delete the option Group
              const deleteGroupResponse: any = await lastValueFrom(
                this.optionGroupService.deleteOptionGroup(group.id)
              );
              if (deleteGroupResponse.status !== "success") {
                this.notify("Error deleting option group", "msg-error");
              }
            }

          // Save the group
          } else {
            // Save the group
            const updateGroupResponse: any = await lastValueFrom(
              this.optionGroupService.updateOptionGroup(group.id, groupData)
            );
            if (updateGroupResponse.status !== "success") {
              this.notify("Error updating option group", "msg-error");
            }

            // Save the toppings
            group.toppings.forEach(async topping => {
              // Setup the topping data
              let toppingData = {
                id: topping.id,
                priceAdjustment: topping.priceAdjustment,
                defaultQuantity: topping.defaultQuantity,
                minQuantity: topping.minQuantity,
                maxQuantity: topping.maxQuantity,
                default: topping.included,
                ingredientId: topping.id
              }

              // Update the option
              const updateToppingResponse: any = await lastValueFrom(
                this.optionService.updateOption(topping.id, toppingData)
              );
              if (updateToppingResponse.status !== "success") {
                this.notify("Error updating option", "msg-error");
              }
            });
          }

        // Saving
        } else {
          // Create the group
          const createGroupResponse: any = await lastValueFrom(
            this.optionGroupService.createOptionGroup({
              ...groupData,
              productId: this.id
            })
          );
          if (createGroupResponse.status !== "success") {
            this.notify("Error creating option group", "msg-error");
            return;
          }
          group.id = createGroupResponse.data.id;

          // Save the toppings
          group.toppings.forEach(async topping => {
            if (!topping.remove) {
              // Setup the topping data
              let toppingData = {
                priceAdjustment: topping.priceAdjustment,
                defaultQuantity: topping.defaultQuantity,
                minQuantity: topping.minQuantity,
                maxQuantity: topping.maxQuantity,
                default: topping.included,
                ingredientId: topping.id
              }

              // Create the option
              const createToppingResponse: any = await lastValueFrom(
                this.optionService.createOption(toppingData)
              );
              if (createToppingResponse.status !== "success") {
                this.notify("Error creating option", "msg-error");
              } else {
                topping.id = createToppingResponse.data.id;
              }

              // Add the option to the group
              const addOptionToGroupResponse: any = await lastValueFrom(
                this.optionGroupService.addOptionToOptionGroup(group.id, topping.id)
              );
              if (addOptionToGroupResponse.status !== "success") {
                this.notify("Error adding option to group", "msg-error");
              }
            }
          });
        }
      });
    } catch (error) {
      console.error("Error saving product:", error);
      this.notify("Error saving product", "msg-error");
    }

    /////////////////////////////////////////
    // Inform user creation was successful //
    /////////////////////////////////////////
    this.notify("Product created successfully", "msg-success", true);
  }


}
