import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, PaginationMeta } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-500 mt-1">{{ meta()?.total ?? 0 }} total products</p>
        </div>
        @if (isAdmin()) {
          <a routerLink="/products/new" class="btn-primary flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </a>
        }
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
                placeholder="Search products..."
                class="input-field pl-9">
            </div>
          </div>
          <select [(ngModel)]="selectedCategory" (ngModelChange)="onFilter()"
            class="input-field w-full sm:w-48">
            <option value="">All categories</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          <select [(ngModel)]="sortOrder" (ngModelChange)="onFilter()"
            class="input-field w-full sm:w-40">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="card animate-pulse">
              <div class="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (products().length === 0) {
        <div class="text-center py-16">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p class="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          @for (product of products(); track product.id) {
            <div class="card group hover:shadow-md transition-shadow p-0 overflow-hidden">
              <!-- Image -->
              <div class="h-40 bg-gray-100 overflow-hidden">
                @if (product.image_url) {
                  <img [src]="product.image_url" [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
              </div>

              <!-- Content -->
              <div class="p-4">
                <div class="flex items-start justify-between mb-1">
                  <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ product.name }}</h3>
                  @if (product.quantity <= 10) {
                    <span class="badge-low-stock ml-2 flex-shrink-0">Low</span>
                  }
                </div>
                <p class="text-xs text-gray-500 mb-2">{{ product.category }}</p>
                <p class="text-xs text-gray-400 mb-3 line-clamp-2">{{ product.description }}</p>

                <div class="flex items-center justify-between">
                  <span class="text-base font-bold text-blue-600">₱{{ product.price | number:'1.2-2' }}</span>
                  <span class="text-xs text-gray-500">{{ product.quantity }} in stock</span>
                </div>

                <div class="mt-3 flex gap-2">
                  <a [routerLink]="['/products', product.id]"
                    class="flex-1 text-center text-xs py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    View
                  </a>
                  @if (isAdmin()) {
                    <a [routerLink]="['/products', product.id, 'edit']"
                      class="flex-1 text-center text-xs py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Edit
                    </a>
                    <button (click)="deleteProduct(product)"
                      class="flex-1 text-xs py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (meta() && (meta()?.totalPages ?? 0) > 1) {
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
              Showing {{ ((meta()?.page ?? 1) - 1) * (meta()?.limit ?? 10) + 1 }}–
              {{ Math.min((meta()?.page ?? 1) * (meta()?.limit ?? 10), meta()?.total ?? 0) }}
              of {{ meta()?.total ?? 0 }}
            </p>
            <div class="flex gap-2">
              <button [disabled]="currentPage() === 1"
                (click)="goToPage(currentPage() - 1)"
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              @for (p of pages(); track p) {
                <button (click)="goToPage(p)"
                  class="px-3 py-1.5 text-sm border rounded-lg"
                  [class.bg-blue-600]="p === currentPage()"
                  [class.text-white]="p === currentPage()"
                  [class.border-blue-600]="p === currentPage()"
                  [class.border-gray-300]="p !== currentPage()"
                  [class.hover:bg-gray-50]="p !== currentPage()">
                  {{ p }}
                </button>
              }
              <button [disabled]="currentPage() === (meta()?.totalPages ?? 1)"
                (click)="goToPage(currentPage() + 1)"
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        }
      }

      <!-- Delete confirm -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p class="text-gray-600 text-sm mb-5">
              Are you sure you want to delete <strong>{{ deleteTarget()?.name }}</strong>? This action cannot be undone.
            </p>
            <div class="flex gap-3 justify-end">
              <button (click)="deleteTarget.set(null)" class="btn-secondary text-sm">Cancel</button>
              <button (click)="confirmDelete()" [disabled]="deleting()" class="btn-danger text-sm">
                {{ deleting() ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  meta = signal<PaginationMeta | null>(null);
  loading = signal(true);
  deleteTarget = signal<Product | null>(null);
  deleting = signal(false);

  currentPage = signal(1);
  searchQuery = '';
  selectedCategory = '';
  sortOrder = 'desc';

  Math = Math;

  private searchSubject = new Subject<string>();

  constructor(private productService: ProductService, public authService: AuthService) {}

  get isAdmin() { return this.authService.isAdmin; }

  get pages(): () => number[] {
    return () => {
      const total = this.meta()?.totalPages ?? 1;
      return Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
    };
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.currentPage.set(1);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll({
      page: this.currentPage(),
      limit: 12,
      search: this.searchQuery,
      category: this.selectedCategory,
      sortBy: 'created_at',
      sortOrder: this.sortOrder as 'asc' | 'desc',
    }).subscribe({
      next: (res) => {
        this.products.set(res.data ?? []);
        this.meta.set(res.meta ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data ?? []),
    });
  }

  onSearch(val: string): void {
    this.searchSubject.next(val);
  }

  onFilter(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    this.deleteTarget.set(product);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleting.set(true);
    this.productService.delete(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.deleting.set(false);
        this.loadProducts();
      },
      error: () => this.deleting.set(false),
    });
  }
}
