import React, { useState } from 'react';

const QuickAdd = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch('https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        priority: 'MEDIUM',
        completed: false
      })
    });

    setTitle('');
    onAdd();
  };

  return (
    <form className="quick-add" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="➕ Quick Add a task and press Enter..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
    </form>
  );
};

export default QuickAdd;
