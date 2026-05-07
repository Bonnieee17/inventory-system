import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { productService } from '../services/product.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProductController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, category, sortBy, sortOrder } = req.query;

      const result = await productService.getAll({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        search: search as string,
        category: category as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      const pageNum = page ? parseInt(page as string) : 1;
      const limitNum = limit ? parseInt(limit as string) : 10;

      res.json({
        success: true,
        message: 'Products fetched',
        data: result.products,
        meta: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, message: 'Product fetched', data: product });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        return;
      }

      let image_url: string | undefined;

      if (req.file) {
        image_url = await productService.uploadImage(req.file);
      }

      const product = await productService.create({
        ...req.body,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
        image_url,
        created_by: req.user!.userId,
      });

      res.status(201).json({ success: true, message: 'Product created', data: product });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        return;
      }

      const existing = await productService.getById(req.params.id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      let image_url = existing.image_url;
      if (req.file) {
        image_url = await productService.uploadImage(req.file);
      }

      const updateData: Record<string, unknown> = { ...req.body, image_url };
      if (req.body.price) updateData.price = parseFloat(req.body.price);
      if (req.body.quantity) updateData.quantity = parseInt(req.body.quantity);

      const product = await productService.update(req.params.id, updateData);
      res.json({ success: true, message: 'Product updated', data: product });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await productService.getById(req.params.id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      await productService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await productService.getCategories();
      res.json({ success: true, message: 'Categories fetched', data: categories });
    } catch (err) {
      next(err);
    }
  }

  async getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await productService.getDashboardStats();
      res.json({ success: true, message: 'Dashboard stats fetched', data: stats });
    } catch (err) {
      next(err);
    }
  }

  async uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const url = await productService.uploadImage(req.file);
      res.json({ success: true, message: 'Image uploaded', data: { url } });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
