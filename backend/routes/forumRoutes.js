import express from 'express';
import { getPosts, createPost, addComment, upvotePost } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id/comment').post(protect, addComment);
router.route('/:id/upvote').post(protect, upvotePost);

export default router;
