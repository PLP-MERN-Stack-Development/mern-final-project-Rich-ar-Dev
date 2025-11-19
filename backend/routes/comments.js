const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Task = require('../models/Task');

const router = express.Router();

// Get comments for a task
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('project', 'owner team');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = task.project;
    const hasAccess = project.owner.toString() === req.user.id || 
                     project.team.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'username email avatar')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error while fetching comments' });
  }
});

// Create new comment
router.post('/', [
  auth,
  body('content').notEmpty().withMessage('Comment content is required'),
  body('task').isMongoId().withMessage('Valid task ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, task } = req.body;

    // Check if user has access to the task
    const taskDoc = await Task.findById(task)
      .populate('project', 'owner team');

    if (!taskDoc) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = taskDoc.project;
    const hasAccess = project.owner.toString() === req.user.id || 
                     project.team.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this task' });
    }

    const comment = new Comment({
      content,
      task,
      author: req.user.id
    });

    await comment.save();
    await comment.populate('author', 'username email avatar');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Server error while creating comment' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only comment author can delete their comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error while deleting comment' });
  }
});

module.exports = router;