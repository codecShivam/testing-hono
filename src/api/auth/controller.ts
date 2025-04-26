import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { userService } from '../users/service';
import { verifyPassword, generateToken } from '../../utils/auth';

export const authController = {

    login: async (c: Context) => {
        try {
            const { email, password } = await c.req.json();
            const user = await userService.findByEmail(email);
            if (!user) {
                return c.json({ error: 'Invalid email or password' }, 401);
            }
            const isValidPassword = verifyPassword(password, user.password);
            if (!isValidPassword) {
                return c.json({ error: 'Invalid email or password' }, 401);
            }
            const token = generateToken(user);
            return c.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            throw new HTTPException(500, { message: 'Authentication failed' });
        }
    },

    getProfile: async (c: Context) => {
        try {
            const user = c.get('user');
            return c.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Profile error:', error);
            throw new HTTPException(500, { message: 'Failed to retrieve profile' });
        }
    }
}; 