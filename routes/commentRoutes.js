
import express from 'express';
import { addComment, getCommentsByCrimeId, deleteComment, getCommentById } from '../data/comments.js';
import { getFlagCount } from '../data/flags.js';
import { getUserById } from '../data/users.js';
import { connectToDb } from '../config/mongoConnection.js';

const router = express.Router();

// Get comments for a crime
router.get('/:crimeId', async (req, res) => {
  try {
    const { crimeId } = req.params;
    const comments = await getCommentsByCrimeId(crimeId);
    
    // Get flag counts for each comment
    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const flagCount = await getFlagCount(comment._id.toString(), 'comment');
        return {
          ...comment,
          flagCount,
          username: comment.username || 'Deleted User'
        };
      })
    );

    res.json(commentsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment
router.post('/:crimeId', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'You must be logged in to comment' });
    }

    const { crimeId } = req.params;
    const { content } = req.body;
    const username = req.session.user.username;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const commentId = await addComment(crimeId, username, content.trim());
    res.json({ success: true, commentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new comment
router.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'You must be logged in to comment' });
    }

    const { crimeId, content } = req.body;
    if (!crimeId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const username = req.session.user.username;
    const commentId = await addComment(crimeId, username, content);
    const comment = await getCommentById(commentId);

    const db = await connectToDb();
    const users = db.collection('users');

    await users.findOneAndUpdate({ username }, { $push: { comments: comment }});

    res.json({
      ...comment,
      username: comment.username || 'Deleted User'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'You must be logged in to delete comments' });
    }

    const { commentId } = req.params;
    const username = req.session.user.username;

    const result = await deleteComment(commentId, username);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
