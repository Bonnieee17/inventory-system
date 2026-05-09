import { Product, PaginationQuery } from '../types';
export declare class ProductService {
    getAll(query: PaginationQuery): Promise<{
        products: Product[];
        total: number;
    }>;
    getById(id: string): Promise<Product | null>;
    create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    update(id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'created_by'>>): Promise<Product>;
    delete(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
    getDashboardStats(): Promise<{
        totalProducts: number;
        totalValue: number;
        lowStockCount: number;
        categories: number;
    }>;
    uploadImage(file: Express.Multer.File): Promise<string>;
}
export declare const productService: ProductService;
//# sourceMappingURL=product.service.d.ts.map