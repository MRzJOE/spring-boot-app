import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css'; // We'll style it in next step

const API = 'https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks';

function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForDate, setTasksForDate] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const dateStr = date.toISOString().split('T')[0];
    const filtered = tasks.filter(t => t.dueDate === dateStr);
    setTasksForDate(filtered);
  };

  return (
    <div className="calendar-view">
      <h2>📆 Task Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) => {
  const dateStr = date.toISOString().split('T')[0];
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
