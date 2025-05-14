import React, { useState } from 'react';
import { API_ENDPOINTS, getTodayFormatted, handleApiError } from '../config';

const QuickAdd = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    setError(null);
    console.log(`[QuickAdd] Attempting to add task with title: "${title}"`);
    
    try {
      const dueDate = getTodayFormatted();
      console.log(`[QuickAdd] Using date: ${dueDate}`);
      
      const taskData = {
        title,
        priority: 'MEDIUM',
        completed: false,
        dueDate: dueDate
      };
      
      console.log(`[QuickAdd] Sending task data:`, taskData);
      console.log(`[QuickAdd] API endpoint: ${API_ENDPOINTS.TASKS}`);
      
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      console.log(`[QuickAdd] Response status:`, response.status);
      
      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.error(`[QuickAdd] Server error response: ${response.status}`, errorText);
        } catch (err) {
          console.error('[QuickAdd] Could not read error response:', err);
        }
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      let responseData;
      try {
        responseData = await response.json();
        console.log(`[QuickAdd] Task created successfully:`, responseData);
      } catch (jsonErr) {
        console.warn('[QuickAdd] Could not parse JSON response:', jsonErr);
      }
      
      setTitle('');
      onAdd(); // Call the onAdd callback to refresh the task list
    } catch (err) {
      console.error('[QuickAdd] Error adding task:', err);
      setError('Failed to add task: ' + err.message);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="quick-add" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="➕ Quick Add a task and press Enter..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
        {isLoading && <span className="loading-indicator">Adding...</span>}
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default QuickAdd;
