import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';
import { Home as LayoutHome } from './layout/home/home';
import { Products as productDash } from './dashboard/products/products';
import { Home } from './dashboard/home/home';
import { Category } from './dashboard/category/category';
import { Subcategory } from './dashboard/subcategory/subcategory';
import { Users } from './dashboard/users/users';
import { Testimonial } from './dashboard/testimonial/testimonial';
import { Orders } from './dashboard/orders/orders';
import { Account } from './layout/account/account';
import { ProductDetails } from './layout/product-details/product-details';
import { Cart } from './layout/cart/cart';
import { Products } from './layout/products/products';
import { Checkout } from './layout/checkout/checkout';
import { Order } from './layout/order/order';
import { TestMon } from './layout/test-mon/test-mon';
import { userGuard } from './cores/gaurds/user-guard';
import { adminGuard } from './cores/gaurds/admin-guard';
import { checkoutGuard } from './cores/gaurds/checkout-guard';

export const routes: Routes = [
    {
        path: '', component: Layout, children: [
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: LayoutHome },
            { path: "products", component: Products },
            { path: "account", component: Account, canActivate: [userGuard] },
            { path: "products/:slug", component: ProductDetails },
            { path: "cart", component: Cart },
            { path: "checkout", component: Checkout, canActivate: [checkoutGuard] },
            { path: 'orders', component: Order },
            { path: 'testmon', component: TestMon }
        ]
    },
    { path: "login", component: Login },
    { path: "register", component: Register },
    {
        path: 'dashboard', component: Dashboard, canActivate: [adminGuard], children: [
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: Home },
            { path: "products", component: productDash },
            { path: "category", component: Category },
            { path: "subCategory", component: Subcategory },
            { path: "users", component: Users },
            { path: "testimonial", component: Testimonial },
            { path: "orders", component: Orders }
        ]
    }
];
