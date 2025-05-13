import React, { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import QuickAdd from './components/QuickAdd';
import CalendarView from './components/CalendarView';
import { motion } from 'framer-motion';

const API_URL = 'https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');

const fetchTasks = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // ✅ Ensure the result is an array before setting it
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      console.error('API returned non-array:', data);
      setTasks([]); // fallback to empty
    }
  } catch (error) {
    console.error('Fetch failed:', error);
    setTasks([]); // fallback to empty
  }
};


  useEffect(() => {
    fetchTasks();

    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.body.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="container">
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <h1>📝 Task Manager</h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <QuickAdd onAdd={fetchTasks} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Dashboard />
      </motion.div>

      <TaskForm onTaskCreated={fetchTasks} />
      <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
      <CalendarView />
    </div>
  );
}

export default App;
