import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out"
        [class.-translate-x-full]="!sidebarOpen()"
        [class.translate-x-0]="sidebarOpen()"
      >
        <!-- Logo -->
        <div class="flex items-center px-6 py-5 border-b border-gray-700">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span class="text-white font-bold text-lg">InvenTrack</span>
        </div>

        <!-- Nav Links -->
        <nav class="mt-6 px-3">
          <a routerLink="/dashboard" routerLinkActive="bg-gray-700 text-white"
            class="flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mb-1 group">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>

          <a routerLink="/products" routerLinkActive="bg-gray-700 text-white"
            class="flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mb-1">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </a>

          @if (isAdmin()) {
            <a routerLink="/users" routerLinkActive="bg-gray-700 text-white"
              class="flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </a>
          }
        </nav>

        <!-- User section -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div class="flex items-center mb-3">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span class="text-white text-sm font-medium">{{ userInitial() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ currentUser()?.name }}</p>
              <p class="text-gray-400 text-xs truncate">{{ currentUser()?.role }}</p>
            </div>
          </div>
          <button (click)="logout()"
            class="w-full flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Main content -->
      <div class="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <!-- Top bar -->
        <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button (click)="sidebarOpen.set(!sidebarOpen())"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center space-x-2 ml-auto">
            <span class="text-sm text-gray-600">Welcome, <strong>{{ currentUser()?.name }}</strong></span>
            @if (isAdmin()) {
              <span class="badge-admin">Admin</span>
            } @else {
              <span class="badge-user">User</span>
            }
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 overflow-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  sidebarOpen = signal(true);

  constructor(private authService: AuthService) {}

  get currentUser() { return this.authService.currentUser; }
  get isAdmin() { return this.authService.isAdmin; }

  userInitial() {
    const name = this.currentUser()?.name;
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  logout() {
    this.authService.logout();
  }
}
