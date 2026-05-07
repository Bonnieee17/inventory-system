import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <a routerLink="/products" class="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </a>
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit() ? 'Edit Product' : 'Add Product' }}</h1>
      </div>

      @if (errorMsg()) {
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ errorMsg() }}
        </div>
      }

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" formControlName="name" class="input-field"
                [class.input-error]="isInvalid('name')" placeholder="e.g. Samsung Galaxy S24">
              @if (isInvalid('name')) {
                <p class="mt-1 text-xs text-red-600">Product name is required</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
              <input type="number" formControlName="price" class="input-field"
                [class.input-error]="isInvalid('price')" placeholder="0.00" min="0" step="0.01">
              @if (isInvalid('price')) {
                <p class="mt-1 text-xs text-red-600">Valid price is required</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" formControlName="quantity" class="input-field"
                [class.input-error]="isInvalid('quantity')" placeholder="0" min="0">
              @if (isInvalid('quantity')) {
                <p class="mt-1 text-xs text-red-600">Valid quantity is required</p>
              }
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input type="text" formControlName="category" class="input-field"
                [class.input-error]="isInvalid('category')"
                placeholder="e.g. Electronics, Clothing, Food...">
              @if (isInvalid('category')) {
                <p class="mt-1 text-xs text-red-600">Category is required</p>
              }
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea formControlName="description" rows="3" class="input-field resize-none"
                placeholder="Product description..."></textarea>
            </div>

            <!-- Image Upload -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div class="flex items-start gap-4">
                <!-- Preview -->
                <div class="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  @if (imagePreview()) {
                    <img [src]="imagePreview()!" alt="Preview" class="w-full h-full object-cover">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      </svg>
                    </div>
                  }
                </div>
                <div class="flex-1">
                  <label class="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div class="text-center">
                      <svg class="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="text-sm text-gray-500">Click to upload image</p>
                      <p class="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" class="hidden" (change)="onFileChange($event)">
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" [disabled]="loading()" class="btn-primary flex items-center">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              } @else {
                {{ isEdit() ? 'Update Product' : 'Create Product' }}
              }
            </button>
            <a routerLink="/products" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  loading = signal(false);
  errorMsg = signal('');
  isEdit = signal(false);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;
  productId: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEdit.set(true);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string): void {
    this.productService.getById(id).subscribe({
      next: (res) => {
        const p = res.data;
        if (!p) return;
        this.form.patchValue({
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          category: p.category,
        });
        if (p.image_url) {
          this.imagePreview.set(p.image_url);
        }
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const formData = new FormData();
    const values = this.form.getRawValue();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('quantity', values.quantity.toString());
    formData.append('category', values.category);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.isEdit() && this.productId
      ? this.productService.update(this.productId, formData)
      : this.productService.create(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err: { error?: { message?: string } }) => {
        this.errorMsg.set(err.error?.message || 'Something went wrong');
        this.loading.set(false);
      },
    });
  }
}
