import { ProductImage } from './product-image.model';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  isActive: boolean;
  createdAt: string;          // ISO date string
  images?: ProductImage[];
}
