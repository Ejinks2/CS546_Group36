import express from 'express';
import { addFlag, removeFlag, hasUserFlagged, getFlagCount } from '../data/flags.js';

const router = express.Router();

// Add a flag to content (comment or report)
router.post('/:contentType/:contentId', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'You must be logged in to flag content' });
    }

    const { contentType, contentId } = req.params;
    const { reason } = req.body;
    const userId = req.session.user.username;

    // Validate content type
    if (!['comment', 'report'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Check if user has already flagged this content
    const alreadyFlagged = await hasUserFlagged(contentId, contentType, userId);
    if (alreadyFlagged) {
      return res.status(400).json({ error: 'You have already flagged this content' });
    }

    // Add the flag
    await addFlag(contentId, contentType, userId, reason);
    
    // Get updated flag count
    const flagCount = await getFlagCount(contentId, contentType);

    res.json({ 
      success: true, 
      flagCount,
      message: 'Content flagged successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a flag from content
router.delete('/:contentType/:contentId', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'You must be logged in to remove flags' });
    }

    const { contentType, contentId } = req.params;
    const userId = req.session.user.username;

    // Validate content type
    if (!['comment', 'report'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Remove the flag
    const result = await removeFlag(contentId, contentType, userId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Flag not found' });
    }

    // Get updated flag count
    const flagCount = await getFlagCount(contentId, contentType);

    res.json({ 
      success: true, 
      flagCount,
      message: 'Flag removed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flag count for content
router.get('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    
    // Validate content type
    if (!['comment', 'report'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const flagCount = await getFlagCount(contentId, contentType);
    const hasFlagged = req.session.user 
      ? await hasUserFlagged(contentId, contentType, req.session.user.username)
      : false;

    res.json({ flagCount, hasFlagged });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
