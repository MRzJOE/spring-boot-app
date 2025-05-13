import React, { useState } from 'react';

const priorities = ['LOW', 'MEDIUM', 'HIGH'];

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, priority }),
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
    onTaskCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></textarea>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        required
      />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        {priorities.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
