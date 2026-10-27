import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: { type: String, required: true },
  authorRole: { type: String, default: 'farmer' },
  content: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerifiedSolution: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const forumPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Pest & Disease', 'Soil & Fertilizers', 'Irrigation & Tech', 'Organic Methods', 'Market & Schemes', 'General'],
      default: 'General',
    },
    tags: [{ type: String }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
