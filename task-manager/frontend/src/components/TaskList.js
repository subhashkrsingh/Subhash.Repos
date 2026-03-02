import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onEdit, onDelete, onToggleStatus, actionLoadingId }) {
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks available. Start by adding one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          isProcessing={actionLoadingId === task.id}
        />
      ))}
    </ul>
  );
}

export default TaskList;
