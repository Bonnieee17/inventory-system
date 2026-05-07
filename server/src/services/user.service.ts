import { supabase } from '../config/supabase';
import { User } from '../types';

export class UserService {
  async getAll(): Promise<Omit<User, 'password_hash'>[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async updateRole(id: string, role: 'admin' | 'user'): Promise<Omit<User, 'password_hash'>> {
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, name, role, created_at, updated_at')
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to update role');
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const userService = new UserService();
