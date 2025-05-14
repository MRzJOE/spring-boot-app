import React, { useState } from 'react';
import { API_ENDPOINTS, getTodayFormatted, handleApiError } from '../config';

const priorities = ['LOW', 'MEDIUM', 'HIGH'];

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayFormatted());
  const [priority, setPriority] = useState('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, priority }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      setTitle('');
      setDescription('');
      setDueDate(getTodayFormatted());
      setPriority('MEDIUM');
      onTaskCreated();
    } catch (err) {
      setError('Failed to create task');
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="error-message">{error}</p>}
      
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={isLoading}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={isLoading}
      ></textarea>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        required
        disabled={isLoading}
      />
      <select 
        value={priority} 
        onChange={e => setPriority(e.target.value)}
        disabled={isLoading}
      >
        {priorities.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

export default TaskForm;
