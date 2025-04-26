import { Hono } from 'hono';
import { userRoutes } from './users/routes';
import { postRoutes } from './posts/routes';
import { authRoutes } from './auth/routes';

const apiRoutes = new Hono(); // a new Hono instance for API routes

apiRoutes.get('/', (c) => {
  return c.json({
    name: 'API',
    version: '1.0.0',
  });
});

// Auth routes
apiRoutes.route('/auth', authRoutes);

// User routes
apiRoutes.route('/users', userRoutes);

// Post routes
apiRoutes.route('/posts', postRoutes);

export { apiRoutes }; 