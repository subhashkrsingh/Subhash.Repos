import React from 'react';

function TaskItem({ task, onEdit, onDelete, onToggleStatus, isProcessing }) {
  const isCompleted = task.status === 'Completed';

  const createdDate = new Date(task.createdAt);
  const createdAtLabel = Number.isNaN(createdDate.getTime())
    ? 'Unknown date'
    : createdDate.toLocaleString();

  return (
    <li className="task-item">
      <div className="task-top">
        <h3 className="task-title">{task.title}</h3>
        <span
          className={`task-status ${isCompleted ? 'status-completed' : 'status-pending'}`}
        >
          {task.status}
        </span>
      </div>

      <p className="task-description">{task.description}</p>
      <p className="task-meta">Created: {createdAtLabel}</p>

      <div className="task-actions">
        <button className="edit-btn" onClick={() => onEdit(task)} disabled={isProcessing}>
          Edit
        </button>

        <button
          className="toggle-btn"
          onClick={() => onToggleStatus(task)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Updating...' : isCompleted ? 'Mark Pending' : 'Mark Completed'}
        </button>

        <button className="delete-btn" onClick={() => onDelete(task.id)} disabled={isProcessing}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
