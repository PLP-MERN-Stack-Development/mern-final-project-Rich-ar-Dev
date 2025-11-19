const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('team', 'username email avatar')
    .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('team', 'username email avatar');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error while fetching project' });
  }
});

// Create new project
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Project title is required'),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, deadline, team } = req.body;

    const project = new Project({
      title,
      description,
      owner: req.user.id,
      team: team || [],
      deadline
    });

    await project.save();
    await project.populate('owner', 'username email avatar');
    await project.populate('team', 'username email avatar');

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error while creating project' });
  }
});

// Update project
router.put('/:id', [
  auth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can update certain fields
    if (project.owner.toString() !== req.user.id) {
      delete req.body.team;
      delete req.body.status;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .populate('owner', 'username email avatar')
    .populate('team', 'username email avatar');

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error while updating project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id // Only owner can delete
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error while deleting project' });
  }
});

// Get project tasks
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { team: req.user.id }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate('assignee', 'username email avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

module.exports = router;