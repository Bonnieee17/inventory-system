import { User } from '../types';
export declare class UserService {
    getAll(): Promise<Omit<User, 'password_hash'>[]>;
    getById(id: string): Promise<Omit<User, 'password_hash'> | null>;
    updateRole(id: string, role: 'admin' | 'user'): Promise<Omit<User, 'password_hash'>>;
    delete(id: string): Promise<void>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map