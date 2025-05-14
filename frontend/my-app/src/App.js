import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import QuickAdd from './components/QuickAdd';
import CalendarView from './components/CalendarView';
import { motion } from 'framer-motion';
import { API_ENDPOINTS, handleApiError } from './config';

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[App] Fetching tasks from:', API_ENDPOINTS.TASKS);
      
      const res = await fetch(API_ENDPOINTS.TASKS);
      console.log('[App] Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[App] Fetched tasks:', data && data.length);
      console.log('[App] Fetched tasks data:', data);

      // ✅ Ensure the result is an array before setting it
      if (Array.isArray(data)) {
        setTasks(data);
        setLastUpdate(Date.now());
      } else {
        console.error('[App] API did not return an array:', data);
        throw new Error('API did not return an array');
      }
    } catch (error) {
      console.error('[App] Failed to fetch tasks:', error);
      setError('Failed to fetch tasks: ' + error.message);
      handleApiError(error);
      setTasks([]); // fallback to empty
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllTasks = async () => {
    if (window.confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(API_ENDPOINTS.CLEAR_ALL_TASKS, {
          method: 'DELETE'
        });
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        // Refresh tasks after clearing
        fetchTasks();
      } catch (error) {
        setError('Failed to clear tasks');
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();

    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.body.setAttribute('data-theme', saved);
    // Removed setInterval to prevent auto-refresh
    return () => {};
  }, [fetchTasks]);

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
        <button onClick={clearAllTasks} className="clear-all-button">
          🗑️ Clear All Tasks
        </button>
        <button 
          onClick={() => {
            const testUrl = API_ENDPOINTS.TASKS;
            console.log('Testing API connection to:', testUrl);
            fetch(testUrl)
              .then(res => {
                console.log('API test response status:', res.status);
                return res.text();
              })
              .then(text => {
                console.log('API test response text:', text.substring(0, 100) + '...');
                alert(`API test: ${text ? 'Connected!' : 'No data'}`);
              })
              .catch(err => {
                console.error('API test error:', err);
                alert(`API test failed: ${err.message}`);
              });
          }}
          className="test-api-button"
        >
          🔌 Test API
        </button>
      </div>

      <h1>📝 Task Manager</h1>

      {error && <div className="error-message">Error: {error}</div>}

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
      {isLoading ? (
        <p className="loading-message">Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
      )}
      <CalendarView />
    </div>
  );
}

export default App;
