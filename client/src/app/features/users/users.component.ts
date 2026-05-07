import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-500 mt-1">Manage system users and roles</p>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="flex items-center gap-4 animate-pulse">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div class="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            }
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">User</th>
                  <th class="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Role</th>
                  <th class="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Joined</th>
                  <th class="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (user of users(); track user.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="py-3 pr-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span class="text-white text-sm font-medium">{{ user.name.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ user.name }}</p>
                          <p class="text-xs text-gray-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 pr-4">
                      @if (user.role === 'admin') {
                        <span class="badge-admin">Admin</span>
                      } @else {
                        <span class="badge-user">User</span>
                      }
                    </td>
                    <td class="py-3 pr-4 text-gray-500">{{ user.created_at | date:'mediumDate' }}</td>
                    <td class="py-3">
                      <div class="flex justify-end gap-2">
                        @if (user.id !== currentUserId()) {
                          <button
                            (click)="toggleRole(user)"
                            [disabled]="updatingId() === user.id"
                            class="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                            {{ updatingId() === user.id ? 'Saving...' : (user.role === 'admin' ? 'Make User' : 'Make Admin') }}
                          </button>
                          <button
                            (click)="deleteTarget.set(user)"
                            class="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        } @else {
                          <span class="text-xs text-gray-400 italic">You</span>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (users().length === 0) {
            <p class="text-center text-gray-400 py-8">No users found</p>
          }
        }
      </div>

      <!-- Delete Confirm Modal -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
            <p class="text-gray-600 text-sm mb-5">
              Are you sure you want to delete <strong>{{ deleteTarget()?.name }}</strong>? This cannot be undone.
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
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  updatingId = signal<string | null>(null);
  deleteTarget = signal<User | null>(null);
  deleting = signal(false);
  currentUserId = signal<string | null>(null);

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId.set(this.authService.currentUser()?.id ?? null);
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.updatingId.set(user.id);
    this.userService.updateRole(user.id, newRole).subscribe({
      next: (res) => {
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, role: res.data?.role ?? newRole } : u))
        );
        this.updatingId.set(null);
      },
      error: () => this.updatingId.set(null),
    });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    this.userService.delete(target.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== target.id));
        this.deleteTarget.set(null);
        this.deleting.set(false);
      },
      error: () => this.deleting.set(false),
    });
  }
}
