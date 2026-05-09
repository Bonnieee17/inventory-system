"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const supabase_1 = require("../config/supabase");
const uuid_1 = require("uuid");
class ProductService {
    async getAll(query) {
        const { page = 1, limit = 10, search, category, sortBy = 'created_at', sortOrder = 'desc', } = query;
        const offset = (page - 1) * limit;
        let dbQuery = supabase_1.supabase
            .from('products')
            .select('*, creator:users!products_created_by_fkey(name, email)', { count: 'exact' });
        if (search) {
            dbQuery = dbQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
        }
        if (category) {
            dbQuery = dbQuery.eq('category', category);
        }
        dbQuery = dbQuery
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);
        const { data, error, count } = await dbQuery;
        if (error) {
            throw new Error(error.message);
        }
        return { products: data || [], total: count || 0 };
    }
    async getById(id) {
        const { data, error } = await supabase_1.supabase
            .from('products')
            .select('*, creator:users!products_created_by_fkey(name, email)')
            .eq('id', id)
            .single();
        if (error || !data)
            return null;
        return data;
    }
    async create(productData) {
        const { data, error } = await supabase_1.supabase
            .from('products')
            .insert({ ...productData })
            .select()
            .single();
        if (error || !data) {
            throw new Error(error?.message || 'Failed to create product');
        }
        return data;
    }
    async update(id, productData) {
        const { data, error } = await supabase_1.supabase
            .from('products')
            .update({ ...productData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error || !data) {
            throw new Error(error?.message || 'Failed to update product');
        }
        return data;
    }
    async delete(id) {
        const { error } = await supabase_1.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async getCategories() {
        const { data, error } = await supabase_1.supabase
            .from('products')
            .select('category')
            .order('category');
        if (error)
            throw new Error(error.message);
        const categories = [...new Set((data || []).map((p) => p.category))];
        return categories;
    }
    async getDashboardStats() {
        const { data, error } = await supabase_1.supabase
            .from('products')
            .select('quantity, price, category');
        if (error)
            throw new Error(error.message);
        const products = data || [];
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const lowStockCount = products.filter((p) => p.quantity <= 10).length;
        const categories = new Set(products.map((p) => p.category)).size;
        return { totalProducts, totalValue, lowStockCount, categories };
    }
    async uploadImage(file) {
        const ext = file.originalname.split('.').pop();
        const fileName = `${(0, uuid_1.v4)()}.${ext}`;
        const bucket = process.env.STORAGE_BUCKET || 'product-images';
        const { error } = await supabase_1.supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        const { data } = supabase_1.supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
        return data.publicUrl;
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=product.service.js.map