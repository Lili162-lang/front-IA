import { ProductImage } from './product-image.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
