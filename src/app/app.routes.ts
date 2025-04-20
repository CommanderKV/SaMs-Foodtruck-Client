import { Routes } from '@angular/router';


////////////////////////////////////
//  Import authorization service  //
////////////////////////////////////
import { AuthGaurdService } from './services/auth-gaurd.service';


//////////////////////////
//  Add the components  //
//////////////////////////
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CreateIngredientComponent } from './components/create-ingredient/create-ingredient.component';
import { unsavedChangesGuard } from './gaurds/unsaved-changes.guard';

/////////////////////////////////////////////
//  Create the routes for the application  //
/////////////////////////////////////////////
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "cart", component: CartComponent },
    { path: "login", component: LoginComponent },
    { path: "menu", component: MenuComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "admin", component: AdminComponent, canActivate: [AuthGaurdService] },
    { path: "admin/invin", component: InventoryComponent, canActivate: [AuthGaurdService], canDeactivate: [unsavedChangesGuard] },
    { path: "admin/createIngredient", component: CreateIngredientComponent, canActivate: [AuthGaurdService] },
    { path: "admin/createIngredient", component: CreateIngredientComponent, canActivate: [AuthGaurdService] },
];
