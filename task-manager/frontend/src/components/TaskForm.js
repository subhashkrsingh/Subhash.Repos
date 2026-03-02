import React, { useEffect, useState } from 'react';

function TaskForm({ onSubmit, editingTask, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Keep form fields synchronized with the selected task in edit mode.
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setErrors({ title: '', description: '' });
    } else {
      setTitle('');
      setDescription('');
      setErrors({ title: '', description: '' });
    }
  }, [editingTask]);

  const validateForm = () => {
    const validationErrors = { title: '', description: '' };
    let isValid = true;

    if (!title.trim()) {
      validationErrors.title = 'Title is required.';
      isValid = false;
    }

    if (!description.trim()) {
      validationErrors.description = 'Description is required.';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const saved = await onSubmit({
      title: title.trim(),
      description: description.trim()
    });

    if (saved && !editingTask) {
      setTitle('');
      setDescription('');
      setErrors({ title: '', description: '' });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>

      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSubmitting}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-actions">
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>

        {editingTask && (
          <button
            className="secondary-btn"
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
