import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { noAuthGuard } from '../core/guards/no-auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PanelComponent } from './pages/panel/panel.component'; 

export const ADMIN_ROUTES: Routes = [
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'products', component: ProductsComponent, title: 'Admin · Products' },
    { path: 'products/new', component: ProductFormComponent, title: 'Admin · New Product' },
    { path: 'products/:id', component: ProductFormComponent, title: 'Admin · Edit Product' },
    { path: 'panel', component: PanelComponent, title: 'Admin · Panel' },
    { path: 'categories', component: CategoriesComponent, title: 'Admin · Categories' },
    { path: '', pathMatch: 'full', redirectTo: 'products' },
];
