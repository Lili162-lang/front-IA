// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'catalog' },

    {
        path: 'catalog',
        loadChildren: () =>
            import('../app/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
    },

    // privado (se agrega después)
    { path: 'admin', loadChildren: () => import('../app/admin/admin.routes').then(m => m.ADMIN_ROUTES) },

    { path: '**', redirectTo: 'catalog' },
];
