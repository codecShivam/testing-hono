import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { postController } from './controller';
import { authMiddleware, ownershipMiddleware } from '../../utils/auth';
import { postService } from './service';

const postRoutes = new Hono();

postRoutes.get('/', postController.getAll);

postRoutes.get('/my-posts', authMiddleware, postController.getUserPosts);

postRoutes.get('/:id', postController.getById);

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
});

postRoutes.post('/', 
  authMiddleware,
  zValidator('json', createPostSchema), 
  postController.create
);

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});

const checkPostOwnership = ownershipMiddleware('post', async (c) => {
  const postId = Number(c.req.param('id'));
  const post = await postService.findById(postId);
  return post ? post.authorId : null;
});

postRoutes.put('/:id', 
  authMiddleware,
  checkPostOwnership,
  zValidator('json', updatePostSchema), 
  postController.update
);

postRoutes.delete('/:id', 
  authMiddleware,
  checkPostOwnership,
  postController.delete
);

export { postRoutes };