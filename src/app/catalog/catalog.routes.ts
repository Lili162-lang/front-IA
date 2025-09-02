// src/app/catalog/catalog.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';

export const CATALOG_ROUTES: Routes = [
    { path: '', component: HomeComponent, title: 'Catálogo' },                // /catalog
    { path: 'products', component: ListComponent, title: 'Productos' },       // /catalog/products
    { path: 'products/:id', component: DetailComponent, title: 'Detalle' },   // /catalog/products/:id
];
