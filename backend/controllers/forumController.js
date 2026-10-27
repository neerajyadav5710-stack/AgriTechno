import ForumPost from '../models/ForumPost.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get all community forum posts
// @route   GET /api/forum
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getDbStatus()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const posts = await ForumPost.find(query)
        .populate('author', 'name role avatar')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: posts.length, data: posts });
    } else {
      let posts = [...mockData.forumPosts];

      if (category && category !== 'All') {
        posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        posts = posts.filter((p) => p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s) || (p.tags && p.tags.some((t) => t.toLowerCase().includes(s))));
      }

      return res.json({ success: true, count: posts.length, data: posts });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new forum post
// @route   POST /api/forum
// @access  Private
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const tagArray = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];

    if (getDbStatus()) {
      const post = await ForumPost.create({
        author: userId,
        authorName: req.user.name,
        title,
        content,
        category: category || 'General',
        tags: tagArray,
        upvotes: [],
        comments: [],
      });
      return res.status(201).json({ success: true, data: post });
    } else {
      const newPost = {
        _id: 'post_' + Date.now(),
        author: userId,
        authorName: req.user.name,
        title,
        content,
        category: category || 'General',
        tags: tagArray,
        upvotes: [],
        comments: [],
        createdAt: new Date(),
      };
      mockData.forumPosts.unshift(newPost);
      return res.status(201).json({ success: true, data: newPost });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to forum post
// @route   POST /api/forum/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    if (getDbStatus()) {
      const post = await ForumPost.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      post.comments.push({
        author: userId,
        authorName: req.user.name,
        authorRole: req.user.role,
        content,
        isVerifiedSolution: req.user.role === 'expert',
      });
      await post.save();
      return res.json({ success: true, data: post });
    } else {
      const post = mockData.forumPosts.find((p) => String(p._id) === String(req.params.id));
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      post.comments.push({
        _id: 'comm_' + Date.now(),
        author: userId,
        authorName: req.user.name,
        authorRole: req.user.role,
        content,
        upvotes: [],
        isVerifiedSolution: req.user.role === 'expert',
        createdAt: new Date(),
      });
      return res.json({ success: true, data: post });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upvote a post
// @route   POST /api/forum/:id/upvote
// @access  Private
export const upvotePost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      const post = await ForumPost.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      const idx = post.upvotes.indexOf(userId);
      if (idx === -1) {
        post.upvotes.push(userId);
      } else {
        post.upvotes.splice(idx, 1);
      }
      await post.save();
      return res.json({ success: true, upvotesCount: post.upvotes.length });
    } else {
      const post = mockData.forumPosts.find((p) => String(p._id) === String(req.params.id));
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      const idx = post.upvotes.indexOf(userId);
      if (idx === -1) {
        post.upvotes.push(userId);
      } else {
        post.upvotes.splice(idx, 1);
      }
      return res.json({ success: true, upvotesCount: post.upvotes.length });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
