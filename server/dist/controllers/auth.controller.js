"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
                return;
            }
            const { email, password, name } = req.body;
            const result = await auth_service_1.authService.register(email, password, name);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
                return;
            }
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Not authenticated' });
                return;
            }
            const user = await auth_service_1.authService.getUserById(req.user.userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.json({ success: true, message: 'User fetched', data: user });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map