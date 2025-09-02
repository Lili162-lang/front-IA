// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'admin/products' },

    // {
    //     path: 'catalog',
    //     loadChildren: () =>
    //         import('../app/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
    // },

    { path: 'admin', loadChildren: () => import('../app/admin/admin.routes').then(m => m.ADMIN_ROUTES) },

    { path: '**', redirectTo: 'admin/products' },

];
