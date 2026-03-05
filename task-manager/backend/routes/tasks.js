const express = require('express');
const Task = require('../models/Task');
const Counter = require('../models/Counter');

const router = express.Router();

// Ensure route IDs are positive integers before querying/updating the array.
function parseTaskId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

// Validate payloads for create and update operations.
function validateTaskPayload(payload, isUpdate = false) {
  const errors = [];

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'title')) {
    if (typeof payload.title !== 'string' || payload.title.trim() === '') {
      errors.push('Title is required and cannot be empty.');
    }
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'description')) {
    if (typeof payload.description !== 'string' || payload.description.trim() === '') {
      errors.push('Description is required and cannot be empty.');
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'status')) {
    const validStatuses = ['Pending', 'Completed'];
    if (!validStatuses.includes(payload.status)) {
      errors.push('Status must be either "Pending" or "Completed".');
    }
  }

  if (isUpdate) {
    const hasUpdatableFields =
      Object.prototype.hasOwnProperty.call(payload, 'title') ||
      Object.prototype.hasOwnProperty.call(payload, 'description') ||
      Object.prototype.hasOwnProperty.call(payload, 'status');

    if (!hasUpdatableFields) {
      errors.push('Provide at least one field to update: title, description, or status.');
    }
  }

  return errors;
}

async function getNextTaskId() {
  const counter = await Counter.findByIdAndUpdate(
    'task_id',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

// Create task
router.post('/', async (req, res, next) => {
  const validationErrors = validateTaskPayload(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
  }

  try {
    const nextTaskId = await getNextTaskId();
    const newTask = await Task.create({
      id: nextTaskId,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      status: 'Pending'
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return next(error);
  }
});

// Get all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ id: 1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
});

// Get one task by ID
router.get('/:id', async (req, res, next) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  try {
    const task = await Task.findOne({ id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
});

// Update task by ID
router.put('/:id', async (req, res, next) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  const validationErrors = validateTaskPayload(req.body, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
  }

  const updateData = {};
  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    updateData.title = req.body.title.trim();
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    updateData.description = req.body.description.trim();
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
    updateData.status = req.body.status;
  }

  try {
    const updatedTask = await Task.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return next(error);
  }
});

// Delete task by ID
router.delete('/:id', async (req, res, next) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({ id });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted successfully.', task: deletedTask });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
