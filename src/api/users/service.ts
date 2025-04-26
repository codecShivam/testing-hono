import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import type { NewUser, User } from '../../db/schema';

export const userService = {

  findAll: async (): Promise<User[]> => {
    return db.select().from(schema.users);
  },

  findById: async (id: number): Promise<User | undefined> => {
    const results = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return results[0];
  },

  // findByEmail: async (email: string): Promise<User | undefined> => {
  //   const results = await db
  //     .select()
  //     .from(schema.users)
  //     .where(eq(schema.users.email, email))
  //     .limit(1);
  //   return results[0];
  // },

  findByEmail: async (email: string): Promise<User | undefined> => {
    const results = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
    return results[0];
  },

  create: async (userData: NewUser): Promise<User> => {
    const results = await db.insert(schema.users).values(userData).returning();
    if (!results[0]) {
      throw new Error('Failed to create user');
    }
    return results[0];
  },

  update: async (id: number, userData: Partial<NewUser>): Promise<User | undefined> => {
    const results = await db
      .update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  },

  delete: async (id: number): Promise<boolean> => {
    const results = await db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning({ id: schema.users.id });
    return results.length > 0;
  }
}; 