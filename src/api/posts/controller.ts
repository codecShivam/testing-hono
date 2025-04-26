import type { Context } from 'hono';
import { postService } from './service';
import { HTTPException } from 'hono/http-exception';

export const postController = {

  getAll: async (c: Context) => {
    try {
      const posts = await postService.findAll();
      return c.json({ posts });
    } catch (error) {
      console.error('Error getting posts:', error);
      throw new HTTPException(500, { message: 'Failed to retrieve posts' });
    }
  },

  getById: async (c: Context) => {
    const id = Number(c.req.param('id'));
    try {
      const post = await postService.findById(id);
      if (!post) {
        return c.json({ error: 'Post not found' }, 404);
      }
      return c.json({ post });
    } catch (error) {
      console.error(`Error getting post ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to retrieve post' });
    }
  },

  getUserPosts: async (c: Context) => {
    try {
      const user = c.get('user');
      console.log(user);
      const posts = await postService.findByAuthorId(user.id);
      return c.json({ posts });
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw new HTTPException(500, { message: 'Failed to retrieve user posts' });
    }
  },

  create: async (c: Context) => {
    try {
      const postData = await c.req.json();
      const user = c.get('user');
      const newPostData = {
        ...postData,
        authorId: user.id
      };
      const newPost = await postService.create(newPostData);
      return c.json({ post: newPost }, 201);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new HTTPException(500, { message: 'Failed to create post' });
    }
  },

  update: async (c: Context) => {
    const id = Number(c.req.param('id'));
    const postData = await c.req.json();
    try {
      const updatedPost = await postService.update(id, postData);
      if (!updatedPost) {
        return c.json({ error: 'Post not found' }, 404);
      }
      return c.json({ post: updatedPost });
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to update post' });
    }
  },

  delete: async (c: Context) => {
    const id = Number(c.req.param('id'));
    try {
      const success = await postService.delete(id);
      if (!success) {
        return c.json({ error: 'Post not found' }, 404);
      }
      return c.json({ success: true }, 200);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw new HTTPException(500, { message: 'Failed to delete post' });
    }
  }
}; 