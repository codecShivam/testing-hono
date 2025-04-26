import { createHash } from 'crypto';
import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { userService } from '../api/users/service';
import { config } from '../configs/config';
import jwt from 'jsonwebtoken';
import type { User } from '../db/schema';

export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hashed = hashPassword(password);
  return hashed === hashedPassword;
}

interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role || 'user',
  };
  return jwt.sign(payload, config.jwtSecret || 'yamisukehiro', {
    expiresIn: '24h'
  });
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    if (!token) {
      throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
    }
    const decodedToken = jwt.verify(
      token,
      config.jwtSecret || 'yamisukehiro'
    ) as unknown as JwtPayload;
    const userId = decodedToken.sub;
    const user = await userService.findById(userId);
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized: User not found' });
    }
    c.set('user', user);
    await next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new HTTPException(401, { message: 'Unauthorized: Token expired' });
    }
    throw new HTTPException(401, { message: 'Unauthorized: Authentication failed' });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user || !allowedRoles.includes(user.role)) {
      throw new HTTPException(403, { message: 'Forbidden: Insufficient permissions' });
    }
    await next();
  };
};

export const ownershipMiddleware = (
  resourceType: string,
  getResourceOwnerId: (c: Context) => Promise<number | null>
) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized: Authentication required' });
    }
    const ownerId = await getResourceOwnerId(c);
    if (ownerId === null) {
      throw new HTTPException(404, { message: `${resourceType} not found` });
    }
    if (user.id !== ownerId) {
      throw new HTTPException(403, {
        message: `Forbidden: You don't have access to this ${resourceType}`
      });
    }
    await next();
  };
}; 