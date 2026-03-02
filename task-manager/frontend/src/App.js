import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

// Normalize API/server errors into a single user-facing message.
function getErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.join(' ');
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return fallbackMessage;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Initial + manual reload of the task list.
  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(API_BASE_URL);
      setTasks(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch tasks.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handles both create and edit modes from one form component.
  const handleSubmitTask = async (taskPayload) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (editingTask) {
        const response = await axios.put(`${API_BASE_URL}/${editingTask.id}`, taskPayload);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === editingTask.id ? response.data : task))
        );
        setEditingTask(null);
      } else {
        const response = await axios.post(API_BASE_URL, taskPayload);
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }

      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save task.'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this task?');
    if (!shouldDelete) {
      return;
    }

    setActionLoadingId(taskId);
    setError('');

    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (task) => {
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

    setActionLoadingId(task.id);
    setError('');

    try {
      const response = await axios.put(`${API_BASE_URL}/${task.id}`, {
        status: updatedStatus
      });

      setTasks((prevTasks) =>
        prevTasks.map((item) => (item.id === task.id ? response.data : item))
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task status.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Plan your work. Update progress. Stay organized.</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
        isSubmitting={isSubmitting}
      />

      <section className="tasks-section">
        {isLoading ? (
          <p className="state-message">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleStartEdit}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            actionLoadingId={actionLoadingId}
          />
        )}
      </section>
    </div>
  );
}

export default App;
