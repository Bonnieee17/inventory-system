import { User } from '../types';
export declare class AuthService {
    register(email: string, password: string, name: string): Promise<{
        user: Omit<User, 'password_hash'>;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: Omit<User, 'password_hash'>;
        token: string;
    }>;
    getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null>;
    private generateToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map