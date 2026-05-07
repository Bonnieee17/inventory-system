import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAll();
      res.json({ success: true, message: 'Users fetched', data: users });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, message: 'User fetched', data: user });
    } catch (err) {
      next(err);
    }
  }

  async updateRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.body;
      if (!['admin', 'user'].includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role. Must be admin or user' });
        return;
      }

      const user = await userService.updateRole(req.params.id, role);
      res.json({ success: true, message: 'Role updated', data: user });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Prevent self-deletion
      if (req.params.id === req.user?.userId) {
        res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        return;
      }

      await userService.delete(req.params.id);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
