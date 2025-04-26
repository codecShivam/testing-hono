import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export const errorHandler = async ( c: Context , next: Next  ) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({
        success: false, 
        error: error.message,
        status: error.status,
      }, error.status);
    }
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof AuthenticationError || error instanceof AuthorizationError || error instanceof BadRequestError || error instanceof InternalServerError) {
      return c.json({
        success: false,
        error: error.message,
        status: error.status,
      }, error.status as ContentfulStatusCode);
    }
    return c.json({
      success: false,
      error: 'Internal Server Error',
    }, 500);
    
  }
}

export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export class AuthenticationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.status = 403;
  }
}

export class BadRequestError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

export class InternalServerError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = `InternalServerError`;
    this.status = 500;
  }
}
