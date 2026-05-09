"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// All product routes require authentication
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /products/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard', product_controller_1.productController.getDashboard.bind(product_controller_1.productController));
/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', product_controller_1.productController.getCategories.bind(product_controller_1.productController));
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination, search, and filtering
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
router.get('/', product_controller_1.productController.getAll.bind(product_controller_1.productController));
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/:id', product_controller_1.productController.getById.bind(product_controller_1.productController));
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, quantity, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post('/', (0, auth_middleware_1.authorize)('admin'), upload_middleware_1.upload.single('image'), [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    (0, express_validator_1.body)('category').trim().notEmpty().withMessage('Category is required'),
], product_controller_1.productController.create.bind(product_controller_1.productController));
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put('/:id', (0, auth_middleware_1.authorize)('admin'), upload_middleware_1.upload.single('image'), [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
], product_controller_1.productController.update.bind(product_controller_1.productController));
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', (0, auth_middleware_1.authorize)('admin'), product_controller_1.productController.delete.bind(product_controller_1.productController));
/**
 * @swagger
 * /products/upload/image:
 *   post:
 *     summary: Upload a product image (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded, returns URL
 */
router.post('/upload/image', (0, auth_middleware_1.authorize)('admin'), upload_middleware_1.upload.single('image'), product_controller_1.productController.uploadImage.bind(product_controller_1.productController));
exports.default = router;
//# sourceMappingURL=product.routes.js.map