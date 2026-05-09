"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const express_validator_1 = require("express-validator");
const product_service_1 = require("../services/product.service");
class ProductController {
    async getAll(req, res, next) {
        try {
            const { page, limit, search, category, sortBy, sortOrder } = req.query;
            const result = await product_service_1.productService.getAll({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
                search: search,
                category: category,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            const pageNum = page ? parseInt(page) : 1;
            const limitNum = limit ? parseInt(limit) : 10;
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
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const product = await product_service_1.productService.getById(req.params.id);
            if (!product) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            res.json({ success: true, message: 'Product fetched', data: product });
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
                return;
            }
            let image_url;
            if (req.file) {
                image_url = await product_service_1.productService.uploadImage(req.file);
            }
            const product = await product_service_1.productService.create({
                ...req.body,
                price: parseFloat(req.body.price),
                quantity: parseInt(req.body.quantity),
                image_url,
                created_by: req.user.userId,
            });
            res.status(201).json({ success: true, message: 'Product created', data: product });
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
                return;
            }
            const existing = await product_service_1.productService.getById(req.params.id);
            if (!existing) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            let image_url = existing.image_url;
            if (req.file) {
                image_url = await product_service_1.productService.uploadImage(req.file);
            }
            const updateData = { ...req.body, image_url };
            if (req.body.price)
                updateData.price = parseFloat(req.body.price);
            if (req.body.quantity)
                updateData.quantity = parseInt(req.body.quantity);
            const product = await product_service_1.productService.update(req.params.id, updateData);
            res.json({ success: true, message: 'Product updated', data: product });
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const existing = await product_service_1.productService.getById(req.params.id);
            if (!existing) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            await product_service_1.productService.delete(req.params.id);
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (err) {
            next(err);
        }
    }
    async getCategories(req, res, next) {
        try {
            const categories = await product_service_1.productService.getCategories();
            res.json({ success: true, message: 'Categories fetched', data: categories });
        }
        catch (err) {
            next(err);
        }
    }
    async getDashboard(req, res, next) {
        try {
            const stats = await product_service_1.productService.getDashboardStats();
            res.json({ success: true, message: 'Dashboard stats fetched', data: stats });
        }
        catch (err) {
            next(err);
        }
    }
    async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }
            const url = await product_service_1.productService.uploadImage(req.file);
            res.json({ success: true, message: 'Image uploaded', data: { url } });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ProductController = ProductController;
exports.productController = new ProductController();
//# sourceMappingURL=product.controller.js.map