import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authController } from './controller';
import { authMiddleware } from '../../utils/auth';

const authRoutes = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRoutes.post('/login', zValidator('json', loginSchema), authController.login);

authRoutes.get('/profile', authMiddleware, authController.getProfile);

export { authRoutes }; 