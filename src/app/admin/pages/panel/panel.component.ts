// admin-products.page.ts
import {
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
 
type ID = string;

interface Product {
  id: ID;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  active: boolean;
  image?: string;
  updatedAt: string; // ISO
}

type SortKey = keyof Pick<Product, 'name' | 'sku' | 'price' | 'stock' | 'category' | 'updatedAt'>;

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']

})
export class PanelComponent {
  
  // Propiedades para las estadísticas del dashboard
  totalProducts: number = 0;
  totalCategories: number = 0;
  lowStockItems: number = 0;
  
  constructor(private router: Router) {
    // Inicializar con datos de ejemplo
    this.loadDashboardStats();
  }

  // Cargar estadísticas del dashboard
  private loadDashboardStats(): void {
    // TODO: Conectar con servicios reales cuando estén disponibles
    this.totalProducts = 25;
    this.totalCategories = 8;
    this.lowStockItems = 3;
  }

  // Métodos de navegación para las tarjetas del panel
  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  navigateToCategories(): void {
    // TODO: Implementar cuando se cree la página de categorías
    console.log('Navegando a categorías...');
  }

  navigateToInventory(): void {
    // TODO: Implementar cuando se cree la página de inventario
    console.log('Navegando a inventario...');
  }

  navigateToSettings(): void {
    // TODO: Implementar cuando se cree la página de configuración
    console.log('Navegando a configuración...');
  }
}
