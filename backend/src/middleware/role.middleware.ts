import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const checkRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({
          message: 'You do not have permission to perform this action'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Role verification failed'
      });
    }
  };
};