"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    async getAll(req, res, next) {
        try {
            const users = await user_service_1.userService.getAll();
            res.json({ success: true, message: 'Users fetched', data: users });
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const user = await user_service_1.userService.getById(req.params.id);
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
    async updateRole(req, res, next) {
        try {
            const { role } = req.body;
            if (!['admin', 'user'].includes(role)) {
                res.status(400).json({ success: false, message: 'Invalid role. Must be admin or user' });
                return;
            }
            const user = await user_service_1.userService.updateRole(req.params.id, role);
            res.json({ success: true, message: 'Role updated', data: user });
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            // Prevent self-deletion
            if (req.params.id === req.user?.userId) {
                res.status(400).json({ success: false, message: 'Cannot delete your own account' });
                return;
            }
            await user_service_1.userService.delete(req.params.id);
            res.json({ success: true, message: 'User deleted' });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map