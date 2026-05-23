const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const { getIO } = require('../config/socket');

// Helper to emit socket events to the project's room, excluding the initiator socket if provided
const emitToProject = (projectName, eventName, data, excludeSocketId = null) => {
  try {
    const io = getIO();
    const roomName = `project_${projectName}`;

    if (excludeSocketId) {
      io.to(roomName).except(excludeSocketId).emit(eventName, data);
    } else {
      io.to(roomName).emit(eventName, data);
    }

    console.log(`📡 Emitted "${eventName}" to project room: ${roomName}`);
  } catch (err) {
    console.error(`❌ Failed to emit socket event ${eventName}:`, err.message);
  }
};

// @desc    Get all tasks for logged-in user's project
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort = '-createdAt' } = req.query;

    // Build filter query with projectName
    const filter = { 
      user: req.user._id,
      projectName: req.user.projectName,
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Validate sort field
    const allowedSorts = ['-createdAt', 'createdAt', '-dueDate', 'dueDate', 'priority', '-priority', 'title'];
    const sortField = allowedSorts.includes(sort) ? sort : '-createdAt';

    const tasks = await Task.find(filter).sort(sortField).lean();

    // Stats
    const allTasks = await Task.find({ user: req.user._id, projectName: req.user.projectName }).lean();
    const stats = {
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
    };

    res.json({
      success: true,
      count: tasks.length,
      stats,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { title, description, priority, dueDate, status } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status: status || 'pending',
      projectName: req.user.projectName,
    });

    const socketId = req.headers['x-socket-id'];
    emitToProject(req.user.projectName, 'taskCreated', task, socketId);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      projectName: req.user.projectName,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, priority, dueDate, status } = req.body;

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (status !== undefined) task.status = status;

    await task.save();

    const socketId = req.headers['x-socket-id'];
    emitToProject(req.user.projectName, 'taskUpdated', task, socketId);

    res.json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
      projectName: req.user.projectName,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const socketId = req.headers['x-socket-id'];
    emitToProject(req.user.projectName, 'taskDeleted', { taskId: req.params.id, title: task.title, status: task.status }, socketId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
      taskId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      projectName: req.user.projectName,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    const socketId = req.headers['x-socket-id'];
    emitToProject(req.user.projectName, 'taskToggled', task, socketId);

    res.json({
      success: true,
      message: `Task marked as ${task.status}`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTask };
