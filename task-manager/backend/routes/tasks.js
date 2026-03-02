const express = require('express');

const router = express.Router();

let tasks = [];
let nextId = 1;

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

// Create task
router.post('/', (req, res) => {
  const validationErrors = validateTaskPayload(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
  }

  const newTask = {
    id: nextId++,
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    status: 'Pending',
    createdAt: new Date()
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

// Get all tasks
router.get('/', (req, res) => {
  return res.status(200).json(tasks);
});

// Get one task by ID
router.get('/:id', (req, res) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.status(200).json(task);
});

// Update task by ID
router.put('/:id', (req, res) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const validationErrors = validateTaskPayload(req.body, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    task.title = req.body.title.trim();
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    task.description = req.body.description.trim();
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
    task.status = req.body.status;
  }

  return res.status(200).json(task);
});

// Delete task by ID
router.delete('/:id', (req, res) => {
  const id = parseTaskId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  return res.status(200).json({ message: 'Task deleted successfully.', task: deletedTask });
});

module.exports = router;
