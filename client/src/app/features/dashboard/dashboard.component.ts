import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, Product } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Overview of your inventory</p>
      </div>

      <!-- Stats Cards -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          @for (i of [1,2,3,4]; track i) {
            <div class="card animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div class="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-500">Total Products</span>
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()?.totalProducts ?? 0 }}</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-500">Total Value</span>
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">₱{{ (stats()?.totalValue ?? 0) | number:'1.2-2' }}</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-500">Low Stock</span>
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                [class.bg-red-100]="(stats()?.lowStockCount ?? 0) > 0"
                [class.bg-gray-100]="(stats()?.lowStockCount ?? 0) === 0">
                <svg class="w-5 h-5"
                  [class.text-red-600]="(stats()?.lowStockCount ?? 0) > 0"
                  [class.text-gray-400]="(stats()?.lowStockCount ?? 0) === 0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold"
              [class.text-red-600]="(stats()?.lowStockCount ?? 0) > 0"
              [class.text-gray-900]="(stats()?.lowStockCount ?? 0) === 0">
              {{ stats()?.lowStockCount ?? 0 }}
            </p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-500">Categories</span>
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()?.categories ?? 0 }}</p>
          </div>
        </div>
      }

      <!-- Low Stock Alert -->
      @if ((stats()?.lowStockCount ?? 0) > 0) {
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start">
          <svg class="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-red-800">Low Stock Alert</p>
            <p class="text-sm text-red-700 mt-0.5">
              {{ stats()?.lowStockCount }} product(s) have 10 or fewer items remaining.
              <a routerLink="/products" class="underline font-medium">View products →</a>
            </p>
          </div>
        </div>
      }

      <!-- Recent Products -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Recent Products</h2>
          <a routerLink="/products" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</a>
        </div>

        @if (recentProducts().length === 0 && !loading()) {
          <p class="text-gray-400 text-sm text-center py-8">No products yet</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Product</th>
                  <th class="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Category</th>
                  <th class="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Price</th>
                  <th class="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (product of recentProducts(); track product.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="py-3 pr-4">
                      <div class="flex items-center">
                        @if (product.image_url) {
                          <img [src]="product.image_url" [alt]="product.name"
                            class="w-8 h-8 rounded-lg object-cover mr-3">
                        } @else {
                          <div class="w-8 h-8 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                          </div>
                        }
                        <span class="font-medium text-gray-900">{{ product.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 pr-4">
                      <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {{ product.category }}
                      </span>
                    </td>
                    <td class="py-3 pr-4 text-right text-gray-900">₱{{ product.price | number:'1.2-2' }}</td>
                    <td class="py-3 text-right">
                      <span [class]="product.quantity <= 10 ? 'badge-low-stock' : 'text-gray-900 font-medium'">
                        {{ product.quantity }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  recentProducts = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data ?? null);
      },
    });

    this.productService.getAll({ page: 1, limit: 5, sortBy: 'created_at', sortOrder: 'desc' }).subscribe({
      next: (res) => {
        this.recentProducts.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
