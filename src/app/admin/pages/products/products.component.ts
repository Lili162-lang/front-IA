import { ChangeDetectionStrategy, OnDestroy, signal, computed, effect, Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  selectedProducts = signal<Set<number>>(new Set());

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedStatus = signal<string>('');
  selectedStock = signal<string>('');
  sortBy = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  selectedCount = computed(() => this.selectedProducts().size);
  allSelected = computed(() =>
    this.filteredProducts().length > 0 &&
    this.selectedProducts().size === this.filteredProducts().length
  );

  itemHeight = 400;
  visibleItems = 12;
  bufferSize = 6;

  private renderStartTime = 0;
  private lastFilterTime = 0;

  showDeleteModal = signal<boolean>(false);
  showBulkDeleteModal = signal<boolean>(false);
  productToDelete = signal<Product | null>(null);

  // Modal para agregar producto
  showAddModal = signal<boolean>(false);
  addProductForm: FormGroup;
  isSubmitting = signal<boolean>(false);

  categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm.set(term);
    });

    effect(() => {
      this.updateFilteredProducts();
    });

    this.addProductForm = this.createAddForm();
  }

  private createAddForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      originalPrice: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      sku: ['', Validators.required],
      image: [''],
      shipping: this.fb.group({
        isFree: [false],
        estimatedDays: [1, [Validators.min(1), Validators.max(30)]]
      }),
      isActive: [true],
      featured: [false]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.setupPerformanceMonitoring();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupPerformanceMonitoring() {
    if (typeof performance !== 'undefined') {
      this.renderStartTime = performance.now();
    }
  }

  private logPerformance(operation: string) {
    if (typeof performance !== 'undefined') {
      const endTime = performance.now();
      const duration = endTime - this.renderStartTime;
      if (duration > 100) {
        console.warn(`Performance: ${operation} took ${duration.toFixed(2)}ms`);
      }
    }
  }

  private async loadProducts() {
    this.isLoading.set(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Producto ${i + 1}`,
        category: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros'][i % 5],
        price: Math.floor(Math.random() * 500) + 20,
        originalPrice: Math.floor(Math.random() * 600) + 50,
        stock: Math.floor(Math.random() * 100),
        image: `https://picsum.photos/300/200?random=${i + 1}`,
        isActive: Math.random() > 0.2,
        description: `Descripción del producto ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        shipping: {
          isFree: Math.random() > 0.3,
          estimatedDays: Math.floor(Math.random() * 7) + 1
        },
        featured: i < 5,
        discount: Math.floor(Math.random() * 30) + 5
      }));

      this.products.set(mockProducts);
      this.updateFilteredProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoading.set(false);
      this.logPerformance('Product loading');
    }
  }

  private updateFilteredProducts() {
    const startTime = performance.now();

    let filtered = [...this.products()];

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search)
      );
    }

    const category = this.selectedCategory();
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    const status = this.selectedStatus();
    if (status === 'active') {
      filtered = filtered.filter(product => product.isActive);
    } else if (status === 'inactive') {
      filtered = filtered.filter(product => !product.isActive);
    }

    const stock = this.selectedStock();
    if (stock === 'in-stock') {
      filtered = filtered.filter(product => product.stock > 10);
    } else if (stock === 'low-stock') {
      filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
    } else if (stock === 'out-of-stock') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    const sortBy = this.sortBy();
    const direction = this.sortDirection();

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product];
      let bValue: any = b[sortBy as keyof Product];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });

    this.filteredProducts.set(filtered);

    const endTime = performance.now();
    if (endTime - startTime > 50) {
      console.warn(`Filter operation took ${(endTime - startTime).toFixed(2)}ms`);
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
  }

  onStockChange(stock: string) {
    this.selectedStock.set(stock);
  }

  onSortChange(sortBy: string) {
    if (this.sortBy() === sortBy) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortDirection.set('asc');
    }
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedStatus.set('');
    this.selectedStock.set('');
    this.sortBy.set('name');
    this.sortDirection.set('asc');
    this.searchSubject.next('');
  }

  toggleProductSelection(productId: number, event: Event) {
    event.stopPropagation();
    const selected = new Set(this.selectedProducts());

    if (selected.has(productId)) {
      selected.delete(productId);
    } else {
      selected.add(productId);
    }

    this.selectedProducts.set(selected);
  }

  toggleSelectAll() {
    const filtered = this.filteredProducts();
    const selected = this.selectedProducts();

    if (this.allSelected()) {
      const newSelected = new Set(selected);
      filtered.forEach(product => newSelected.delete(product.id));
      this.selectedProducts.set(newSelected);
    } else {
      const newSelected = new Set(selected);
      filtered.forEach(product => newSelected.add(product.id));
      this.selectedProducts.set(newSelected);
    }
  }

  editProduct(productId: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/products', productId]);
  }

  addProduct() {
    console.log('addProduct() called - Current showAddModal state:', this.showAddModal());
    this.showAddModal.set(true);
    console.log('addProduct() - New showAddModal state:', this.showAddModal());
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.addProductForm.reset();
    this.addProductForm.patchValue({
      isActive: true,
      featured: false,
      shipping: { isFree: false, estimatedDays: 1 }
    });
  }

  onSubmitAddProduct() {
    if (this.addProductForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      const formData = this.addProductForm.value;
      const newProduct: Product = {
        id: Math.max(...this.products().map(p => p.id)) + 1,
        ...formData,
        image: formData.image || `https://picsum.photos/300/200?random=${Date.now()}`,
        discount: this.calculateDiscount(formData.originalPrice, formData.price)
      };

      // Simular guardado
      setTimeout(() => {
        const currentProducts = this.products();
        this.products.set([newProduct, ...currentProducts]);
        this.updateFilteredProducts();
        this.isSubmitting.set(false);
        this.closeAddModal();
      }, 1000);
    } else {
      this.markFormGroupTouched(this.addProductForm);
    }
  }

  generateSKU() {
    const randomSKU = 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.addProductForm.patchValue({ sku: randomSKU });
  }

  calculateDiscountInForm() {
    const price = this.addProductForm.get('price')?.value || 0;
    const originalPrice = this.addProductForm.get('originalPrice')?.value || 0;
    return this.calculateDiscount(originalPrice, price);
  }

  private calculateDiscount(originalPrice: number, price: number): number {
    if (originalPrice > price && originalPrice > 0) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleProductStatus(productId: number, event: Event) {
    event.stopPropagation();

    const products = this.products();
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, isActive: !product.isActive }
        : product
    );

    this.products.set(updatedProducts);
    this.updateFilteredProducts();
  }

  toggleSelectedStatus() {
    const selectedIds = Array.from(this.selectedProducts());
    const products = this.products();

    const updatedProducts = products.map(product =>
      selectedIds.includes(product.id)
        ? { ...product, isActive: !product.isActive }
        : product
    );

    this.products.set(updatedProducts);
    this.updateFilteredProducts();
  }

  confirmDelete(product: Product, event: Event) {
    event.stopPropagation();
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  confirmBulkDelete() {
    if (this.selectedCount() > 0) {
      this.showBulkDeleteModal.set(true);
    }
  }

  executeDelete() {
    const productToDelete = this.productToDelete();
    if (productToDelete) {
      const products = this.products();
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      this.products.set(updatedProducts);
      this.updateFilteredProducts();

      const selected = new Set(this.selectedProducts());
      selected.delete(productToDelete.id);
      this.selectedProducts.set(selected);
    }
    this.closeDeleteModal();
  }

  executeBulkDelete() {
    const selectedIds = Array.from(this.selectedProducts());
    const products = this.products();
    const updatedProducts = products.filter(p => !selectedIds.includes(p.id));

    this.products.set(updatedProducts);
    this.selectedProducts.set(new Set());
    this.updateFilteredProducts();
    this.closeBulkDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  closeBulkDeleteModal() {
    this.showBulkDeleteModal.set(false);
  }

  getStockLevel(stock: number): 'low' | 'medium' | 'high' {
    if (stock <= 10) return 'low';
    if (stock <= 50) return 'medium';
    return 'high';
  }

  getStockPercentage(stock: number): number {
    return Math.min((stock / 100) * 100, 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  getVisibleProducts(): Product[] {
    const filtered = this.filteredProducts();
    return filtered.slice(0, this.visibleItems);
  }

  // Getters para validación en template
  get name() { return this.addProductForm.get('name'); }
  get category() { return this.addProductForm.get('category'); }
  get price() { return this.addProductForm.get('price'); }
  get originalPrice() { return this.addProductForm.get('originalPrice'); }
  get stock() { return this.addProductForm.get('stock'); }
  get description() { return this.addProductForm.get('description'); }
  get sku() { return this.addProductForm.get('sku'); }
  get image() { return this.addProductForm.get('image'); }
  get shippingDays() { return this.addProductForm.get('shipping.estimatedDays'); }
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  isActive: boolean;
  description: string;
  sku: string;
  shipping: {
    isFree: boolean;
    estimatedDays: number;
  };
  featured?: boolean;
  discount?: number;
}