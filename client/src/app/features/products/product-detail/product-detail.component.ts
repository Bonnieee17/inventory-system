import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto">
      <a routerLink="/products" class="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-4">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </a>

      @if (loading()) {
        <div class="card animate-pulse">
          <div class="h-64 bg-gray-200 rounded-xl mb-6"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-16 bg-gray-200 rounded-xl"></div>
            <div class="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      } @else if (product()) {
        <div class="card">
          @if (product()!.image_url) {
            <img [src]="product()!.image_url" [alt]="product()!.name"
              class="w-full h-64 object-cover rounded-xl mb-6">
          }

          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ product()!.name }}</h1>
              <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ product()!.category }}
              </span>
            </div>
            @if (isAdmin()) {
              <div class="flex gap-2">
                <a [routerLink]="['/products', product()!.id, 'edit']" class="btn-secondary text-sm">
                  Edit
                </a>
                <button (click)="showDeleteConfirm.set(true)" class="btn-danger text-sm">
                  Delete
                </button>
              </div>
            }
          </div>

          @if (product()!.description) {
            <p class="text-gray-600 mb-6">{{ product()!.description }}</p>
          }

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">Price</p>
              <p class="text-xl font-bold text-blue-600">₱{{ product()!.price | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">In Stock</p>
              <p class="text-xl font-bold" [class.text-red-600]="product()!.quantity <= 10" [class.text-gray-900]="product()!.quantity > 10">
                {{ product()!.quantity }}
              </p>
              @if (product()!.quantity <= 10) {
                <p class="text-xs text-red-500 mt-0.5">Low stock</p>
              }
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">Total Value</p>
              <p class="text-xl font-bold text-gray-900">₱{{ (product()!.price * product()!.quantity) | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 text-xs text-gray-400">
            <p>Added by {{ product()!.creator?.name ?? 'Unknown' }} · {{ product()!.created_at | date:'mediumDate' }}</p>
            @if (product()!.updated_at !== product()!.created_at) {
              <p class="mt-0.5">Last updated {{ product()!.updated_at | date:'mediumDate' }}</p>
            }
          </div>
        </div>
      }

      <!-- Delete dialog -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p class="text-gray-600 text-sm mb-5">
              Are you sure you want to delete <strong>{{ product()!.name }}</strong>?
            </p>
            <div class="flex gap-3 justify-end">
              <button (click)="showDeleteConfirm.set(false)" class="btn-secondary text-sm">Cancel</button>
              <button (click)="deleteProduct()" [disabled]="deleting()" class="btn-danger text-sm">
                {{ deleting() ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  showDeleteConfirm = signal(false);
  deleting = signal(false);

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get isAdmin() { return this.authService.isAdmin; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe({
      next: (res) => {
        this.product.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
    });
  }

  deleteProduct(): void {
    const p = this.product();
    if (!p) return;
    this.deleting.set(true);
    this.productService.delete(p.id).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => this.deleting.set(false),
    });
  }
}
