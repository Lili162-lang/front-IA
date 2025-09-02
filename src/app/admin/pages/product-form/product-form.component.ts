import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  
  categories = [
    'Electrónicos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Libros'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      originalPrice: [0, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      sku: ['', Validators.required],
      isActive: [true],
      featured: [false],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      image: [''],
      shipping: this.fb.group({
        isFree: [false],
        estimatedDays: [1, [Validators.min(1), Validators.max(30)]]
      })
    });
  }

  private loadProduct(id: number) {
    this.isLoading.set(true);
    
    // Simular carga de producto (en producción sería un servicio)
    setTimeout(() => {
      const mockProduct = {
        id: id,
        name: `Producto ${id}`,
        category: this.categories[id % 5],
        price: Math.floor(Math.random() * 500) + 20,
        originalPrice: Math.floor(Math.random() * 600) + 50,
        stock: Math.floor(Math.random() * 100),
        description: `Descripción detallada del producto ${id}`,
        sku: `SKU-${String(id).padStart(3, '0')}`,
        isActive: Math.random() > 0.2,
        featured: id <= 5,
        discount: Math.floor(Math.random() * 30) + 5,
        image: `https://picsum.photos/300/200?random=${id}`,
        shipping: {
          isFree: Math.random() > 0.3,
          estimatedDays: Math.floor(Math.random() * 7) + 1
        }
      };

      this.productForm.patchValue(mockProduct);
      this.isLoading.set(false);
    }, 800);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading.set(true);
      
      const formData = this.productForm.value;
      console.log('Saving product:', formData);
      
      // Simular guardado
      setTimeout(() => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/products']);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.productForm.patchValue({ image: imageUrl });
      };
      
      reader.readAsDataURL(file);
    }
  }

  generateSKU() {
    const randomSKU = 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.productForm.patchValue({ sku: randomSKU });
  }

  calculateDiscount() {
    const price = this.productForm.get('price')?.value || 0;
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    
    if (originalPrice > price && originalPrice > 0) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      this.productForm.patchValue({ discount });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  // Getters para validación en template
  get name() { return this.productForm.get('name'); }
  get category() { return this.productForm.get('category'); }
  get price() { return this.productForm.get('price'); }
  get originalPrice() { return this.productForm.get('originalPrice'); }
  get stock() { return this.productForm.get('stock'); }
  get description() { return this.productForm.get('description'); }
  get sku() { return this.productForm.get('sku'); }
  get discount() { return this.productForm.get('discount'); }
  get shippingDays() { return this.productForm.get('shipping.estimatedDays'); }
}