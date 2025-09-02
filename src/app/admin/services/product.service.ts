import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductsResponse, 
  ProductResponse,
  CategoriesResponse 
} from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = '/api/products';
  private readonly CATEGORIES_URL = '/api/categories';

  constructor(private http: HttpClient) {}

  // Products CRUD
  getProducts(page: number = 1, limit: number = 10, search?: string): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductsResponse>(this.API_URL, { params });
  }

  getProduct(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}/${id}`);
  }

  createProduct(product: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.API_URL, product);
  }

  updateProduct(product: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.API_URL}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

  toggleProductStatus(id: number): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.API_URL}/${id}/toggle-status`, {});
  }

  // Categories
  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(this.CATEGORIES_URL);
  }

  // Bulk operations
  deleteMultipleProducts(ids: number[]): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/bulk`, {
      body: { ids }
    });
  }

  updateMultipleProductsStatus(ids: number[], isActive: boolean): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${this.API_URL}/bulk/status`, {
      ids,
      isActive
    });
  }
}
