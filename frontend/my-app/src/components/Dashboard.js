import React, { useEffect, useState } from 'react';

const API = 'https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [progress, setProgress] = useState(0);

  const fetchAll = async () => {
    const res = await fetch(API);
    const all = await res.json();
    setTasks(all);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTasks = all.filter(t => t.dueDate === todayStr);
    const futureTasks = all.filter(t => t.dueDate > todayStr);

    const done = all.filter(t => t.completed).length;
    const percent = all.length ? Math.round((done / all.length) * 100) : 0;

    setToday(todayTasks);
    setUpcoming(futureTasks);
    setProgress(percent);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="dashboard">
      <h2>📅 Today’s Tasks ({today.length})</h2>
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
