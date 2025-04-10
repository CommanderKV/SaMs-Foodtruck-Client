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

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "order", component: OrderComponent },
    { path: "cart", component: CartComponent },
    { path: "login", component: LoginComponent },
    { path: "productOrder", component: ProductOrdersComponent },
    { path: "product", component: ProductComponent },
];
