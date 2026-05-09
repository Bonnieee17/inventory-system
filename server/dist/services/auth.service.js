"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_1 = require("../config/supabase");
class AuthService {
    async register(email, password, name) {
        // Check if user exists
        const { data: existing } = await supabase_1.supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();
        if (existing) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(12);
        const password_hash = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .insert({
            email: email.toLowerCase(),
            password_hash,
            name,
            role: 'user',
        })
            .select('id, email, name, role, created_at, updated_at')
            .single();
        if (error || !user) {
            throw new Error(error?.message || 'Failed to create user');
        }
        const token = this.generateToken(user);
        return { user, token };
    }
    async login(email, password) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error || !user) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const { password_hash, ...safeUser } = user;
        const token = this.generateToken(safeUser);
        return { user: safeUser, token };
    }
    async getUserById(userId) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('id, email, name, role, created_at, updated_at')
            .eq('id', userId)
            .single();
        if (error || !data)
            return null;
        return data;
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map