import { db, schema } from '../../db';
import { eq, desc } from 'drizzle-orm';
import type { NewPost, Post } from '../../db/schema';

export const postService = {

  findAll: async (): Promise<Post[]> => {
    return db.select().from(schema.posts);
  },

  findById: async (id: number): Promise<Post | undefined> => {
    const results = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .limit(1);
    return results[0];
  },

  findByAuthorId: async (authorId: number): Promise<Post[]> => {
    const results = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.authorId, authorId))
      .orderBy(desc(schema.posts.createdAt));
    return results;
  },

  create: async (postData: NewPost): Promise<Post> => {
    const results = await db
      .insert(schema.posts)
      .values(postData)
      .returning();
    if (!results[0]) {
      throw new Error('Failed to create post');
    }
    return results[0];
  },

  update: async (id: number, postData: Partial<NewPost>): Promise<Post | undefined> => {
    const results = await db
      .update(schema.posts)
      .set(postData)
      .where(eq(schema.posts.id, id))
      .returning();
    return results[0];
  },

  delete: async (id: number): Promise<boolean> => {
    const results = await db
      .delete(schema.posts)
      .where(eq(schema.posts.id, id))
      .returning({ id: schema.posts.id });
    return results.length > 0;
  }
}; 