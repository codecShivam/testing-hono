import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { userController } from './controller';

const userRoutes = new Hono();

userRoutes.get('/', userController.getAll);

userRoutes.get('/:id', userController.getById);

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']).optional(),
});

userRoutes.post('/', zValidator('json', createUserSchema), userController.create);

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']).optional(),
});

userRoutes.put('/:id', zValidator('json', updateUserSchema), userController.update);

userRoutes.delete('/:id', userController.delete);

export { userRoutes };