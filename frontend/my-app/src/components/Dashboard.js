import React, { useEffect, useState, useCallback } from 'react';
import { API_ENDPOINTS, formatDateForApi, handleApiError } from '../config';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('[Dashboard] Fetching tasks from:', API_ENDPOINTS.TASKS);
      
      const res = await fetch(API_ENDPOINTS.TASKS);
      console.log('[Dashboard] Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const all = await res.json();
      console.log('[Dashboard] Fetched tasks:', all && all.length);
      
      if (!Array.isArray(all)) {
        console.error('[Dashboard] API did not return an array:', all);
        throw new Error('API did not return an array');
      }
      
      setTasks(all);

      const todayStr = formatDateForApi(new Date());
      console.log('[Dashboard] Today\'s date string:', todayStr);
      
      const todayTasks = all.filter(t => t.dueDate === todayStr);
      const futureTasks = all.filter(t => t.dueDate > todayStr);

      console.log('[Dashboard] Today\'s tasks:', todayTasks.length);
      console.log('[Dashboard] Upcoming tasks:', futureTasks.length);

      const done = all.filter(t => t.completed).length;
      const percent = all.length ? Math.round((done / all.length) * 100) : 0;

      setToday(todayTasks);
      setUpcoming(futureTasks);
      setProgress(percent);
    } catch (err) {
      console.error('[Dashboard] Failed to load dashboard data:', err);
      setError('Failed to load dashboard data: ' + err.message);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Removed setInterval to prevent auto-refresh
    return () => {};
  }, [fetchAll]);

  return (
    <div className="dashboard">
      {isLoading && <p>Loading dashboard...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <h2>📅 Today's Tasks ({today.length})</h2>
      <ul>
        {today.map(t => <li key={t.id}>{t.title}</li>)}
      </ul>

      <h3>🕒 Upcoming ({upcoming.length})</h3>
      <ul>
        {upcoming.map(t => <li key={t.id}>{t.title} - {t.dueDate}</li>)}
      </ul>

      <div className="progress">
        <p>✅ Progress: {progress}% complete</p>
        <progress value={progress} max="100"></progress>
      </div>
    </div>
  );
}

export default Dashboard;
