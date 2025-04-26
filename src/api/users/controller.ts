import type { Context } from 'hono';
import { userService } from './service';
import { HTTPException } from 'hono/http-exception';
import { hashPassword } from '../../utils/auth';

export const userController = {

  getAll: async (c: Context) => {
    try {
      const users = await userService.findAll();
      return c.json({ users });
    } catch (error) {
      console.error('Error getting users:', error);
      throw new HTTPException(500, { message: 'Failed to retrieve users' });
    }
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param('id'));
    try {
      const user = await userService.findById(id);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      return c.json({ user });
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to retrieve user' });
    }
  },

  create: async (c: Context) => {
    try {
      const userData = await c.req.json();
      
      // Hash the password before storing
      const hashedUserData = {
        ...userData,
        password: hashPassword(userData.password)
      };
      
      const newUser = await userService.create(hashedUserData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = newUser;
      
      return c.json({ user: userWithoutPassword }, 201);
    } catch (error) {
      console.error('Error creating user:', error);

      if (error instanceof Error && error.message.includes('duplicate')) {
        return c.json({ error: 'Email already exists' }, 409);
      }
      throw new HTTPException(500, { message: 'Failed to create user' });
    }
  },

  update: async (c: Context) => {
    const id = Number(c.req.param('id'));
    try {
      const userData = await c.req.json();
      
      // If password is being updated, hash it
      if (userData.password) {
        userData.password = hashPassword(userData.password);
      }
      
      const updatedUser = await userService.update(id, userData);
      
      if (!updatedUser) {
        return c.json({ error: 'User not found' }, 404);
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = updatedUser;
      
      return c.json({ user: userWithoutPassword });
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to update user' });
    }
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param('id'));
    try {
      const success = await userService.delete(id);
      if (!success) {
        return c.json({ error: 'User not found' }, 404);
      }
      return c.json({ success: true }, 200);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to delete user' });
    }
  }
}; 