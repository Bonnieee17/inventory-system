"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const supabase_1 = require("../config/supabase");
class UserService {
    async getAll() {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('id, email, name, role, created_at, updated_at')
            .order('created_at', { ascending: false });
        if (error)
            throw new Error(error.message);
        return data || [];
    }
    async getById(id) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('id, email, name, role, created_at, updated_at')
            .eq('id', id)
            .single();
        if (error || !data)
            return null;
        return data;
    }
    async updateRole(id, role) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('id, email, name, role, created_at, updated_at')
            .single();
        if (error || !data)
            throw new Error(error?.message || 'Failed to update role');
        return data;
    }
    async delete(id) {
        const { error } = await supabase_1.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error)
            throw new Error(error.message);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map