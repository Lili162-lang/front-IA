// admin-products.page.ts
import {
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
 
}
