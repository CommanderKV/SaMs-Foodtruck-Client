import { Routes } from '@angular/router';

//////////////////////////
//  Add the components  //
//////////////////////////
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { ProductOrdersComponent } from './components/product-orders/product-orders.component';
import { ProductComponent } from './components/product/product.component';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';

////////////////////////////////////
//  Import authorization service  //
////////////////////////////////////
import { AuthGaurdService } from './services/auth-gaurd.service';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "order", component: OrderComponent },
    { path: "cart", component: CartComponent },
    { path: "login", component: LoginComponent },
    { path: "productOrder", component: ProductOrdersComponent },
    { path: "product", component: ProductComponent },
    { path: "menu", component: MenuComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "admin", component: AdminComponent, canActivate: [AuthGaurdService] },
];
