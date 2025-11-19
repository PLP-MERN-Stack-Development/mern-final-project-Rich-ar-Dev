const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    // Get projects where user is owner or team member
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    }).select('_id');

    const projectIds = userProjects.map(project => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds }
    })
    .populate('assignee', 'username email avatar')
    .populate('project', 'title')
    .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'username email avatar')
      .populate('project', 'title owner team');

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

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error while fetching task' });
  }
});

// Create new task
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Task title is required'),
  body('project').isMongoId().withMessage('Valid project ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignee, status, priority, dueDate, tags } = req.body;

    // Check if user has access to the project
    const projectDoc = await Project.findOne({
      _id: project,
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    });

    if (!projectDoc) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignee: assignee || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      tags: tags || []
    });

    await task.save();
    await task.populate('assignee', 'username email avatar');
    await task.populate('project', 'title');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

// Update task
router.put('/:id', [
  auth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id)
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

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .populate('assignee', 'username email avatar')
    .populate('project', 'title');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'owner');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only project owner can delete tasks
    if (task.project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

module.exports = router;