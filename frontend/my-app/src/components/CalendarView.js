import React, { useEffect, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';
import { API_ENDPOINTS, formatDateForApi, handleApiError } from '../config';

function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForDate, setTasksForDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const updateTasksForDate = useCallback((date, taskList) => {
    const dateStr = formatDateForApi(date);
    const filtered = taskList.filter(t => t.dueDate === dateStr);
    setTasksForDate(filtered);
  }, []);
  
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('[CalendarView] Fetching tasks from:', API_ENDPOINTS.TASKS);
      
      const res = await fetch(API_ENDPOINTS.TASKS);
      console.log('[CalendarView] Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[CalendarView] Fetched tasks:', data && data.length);
      
      if (Array.isArray(data)) {
        setTasks(data);
        // Update tasks for current selected date
        updateTasksForDate(selectedDate, data);
        setLastUpdate(Date.now());
      } else {
        console.error('[CalendarView] API did not return an array:', data);
        throw new Error('API did not return an array');
      }
    } catch (err) {
      console.error('[CalendarView] Failed to load tasks:', err);
      setError('Failed to load tasks: ' + err.message);
      handleApiError(err);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, updateTasksForDate]);

  // Update the selected date's tasks when date is changed
  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    updateTasksForDate(date, tasks);
  }, [tasks, updateTasksForDate]);
  
  useEffect(() => {
    fetchTasks();
    // Removed setInterval to prevent auto-refresh
    return () => {};
  }, [fetchTasks]);

  return (
    <div className="calendar-view">
      <h2>📆 Task Calendar</h2>
      {isLoading && <p>Loading calendar...</p>}
      {error && <p className="error-message">{error}</p>}
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) => {
          const dateStr = formatDateForApi(date);
          return Array.isArray(tasks) && tasks.some(t => t.dueDate === dateStr)
            ? 'has-task'
            : null;
        }}
      />
      <div className="date-tasks">
        <h3>Tasks on {selectedDate.toDateString()}:</h3>
        {tasksForDate.length === 0 && <p>No tasks for this day.</p>}
        <ul>
          {tasksForDate.map(t => (
            <li key={t.id}>
              <strong>{t.title}</strong> — {t.priority}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarView;
