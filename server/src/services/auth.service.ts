import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { User, JwtPayload } from '../types';

export class AuthService {
  async register(email: string, password: string, name: string): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
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

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const { password_hash, ...safeUser } = user;
    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  }

  async getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data;
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'admin' | 'user',
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();
