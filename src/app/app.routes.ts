import { Routes } from '@angular/router';


////////////////////////////////////
//  Import authorization service  //
////////////////////////////////////
import { AuthGuardService } from './services/auth-guard.service';


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
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { ProductComponent } from './components/product/product.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { CategoryComponent } from './components/category/category.component';
import { ShopComponent } from './components/shop/shop.component';

/////////////////////////////////////////////
//  Create the routes for the application  //
/////////////////////////////////////////////
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "cart", component: CartComponent },
    { path: "login", component: LoginComponent },
    { path: "menu", component: MenuComponent },
    { path: "shop", component: ShopComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "admin", component: AdminComponent, canActivate: [AuthGuardService] },
    { path: "admin/invin", component: InventoryComponent, canActivate: [AuthGuardService], canDeactivate: [unsavedChangesGuard] },
    { path: "admin/ingredient", component: CreateIngredientComponent, canActivate: [AuthGuardService] },
    { path: "admin/menu", component: AdminMenuComponent, canActivate: [AuthGuardService] },
    { path: "admin/product", component: ProductComponent, canActivate: [AuthGuardService] },
    { path: "admin/categories", component: AdminCategoriesComponent, canActivate: [AuthGuardService] },
    { path: "admin/category", component: CategoryComponent, canActivate: [AuthGuardService] },
];
